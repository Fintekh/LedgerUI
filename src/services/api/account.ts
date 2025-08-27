import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  V2Account, 
  V2AccountsCursorResponse, 
  V2AccountResponse, 
  V2Metadata, 
  PaginationParams 
} from '../../types/account';

const API_BASE_URL = 'http://localhost:3068/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountApi = {
  // Count accounts in a ledger
  countAccounts: async (ledgerName: string): Promise<number> => {
    const response = await api.head(`/${ledgerName}/accounts`);
    return parseInt(response.headers['count'] || '0', 10);
  },

  // List accounts from a ledger
  listAccounts: async (ledgerName: string, params?: PaginationParams): Promise<V2AccountsCursorResponse> => {
    const response = await api.get(`/${ledgerName}/accounts`, { 
      data: {}, // Empty request body as required by the API
      params 
    });
    return response.data;
  },

  // Get account by address
  getAccount: async (ledgerName: string, address: string, params?: PaginationParams): Promise<V2AccountResponse> => {
    const response = await api.get(`/${ledgerName}/accounts/${address}`, { 
      data: {}, // Empty request body as required by the API
      params 
    });
    return response.data;
  },

  // Add metadata to an account
  addAccountMetadata: async (ledgerName: string, address: string, metadata: V2Metadata): Promise<void> => {
    await api.post(`/${ledgerName}/accounts/${address}/metadata`, metadata);
  },

  // Delete metadata by key
  deleteAccountMetadata: async (ledgerName: string, address: string, key: string): Promise<void> => {
    await api.delete(`/${ledgerName}/accounts/${address}/metadata/${key}`);
  },
};

// React Query hooks
export const useAccountsCount = (ledgerName: string) => {
  return useQuery({
    queryKey: ['accounts', 'count', ledgerName],
    queryFn: () => accountApi.countAccounts(ledgerName),
    enabled: !!ledgerName,
  });
};

export const useAccounts = (ledgerName: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['accounts', ledgerName, params],
    queryFn: () => accountApi.listAccounts(ledgerName, params),
    enabled: !!ledgerName,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (ledger not found) or 405 (method not allowed)
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useAccount = (ledgerName: string, address: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['account', ledgerName, address, params],
    queryFn: () => accountApi.getAccount(ledgerName, address, params),
    enabled: !!ledgerName && !!address,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (account not found) or 405 (method not allowed)
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useAddAccountMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, address, metadata }: { 
      ledgerName: string; 
      address: string; 
      metadata: V2Metadata; 
    }) => accountApi.addAccountMetadata(ledgerName, address, metadata),
    onSuccess: (_, { ledgerName, address }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['accounts', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['account', ledgerName, address] });
    },
  });
};

export const useDeleteAccountMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, address, key }: { 
      ledgerName: string; 
      address: string; 
      key: string; 
    }) => accountApi.deleteAccountMetadata(ledgerName, address, key),
    onSuccess: (_, { ledgerName, address }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['accounts', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['account', ledgerName, address] });
    },
  });
}; 