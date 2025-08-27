import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  V2Transaction, 
  V2TransactionsCursorResponse, 
  V2CreateTransactionResponse, 
  V2GetTransactionResponse,
  V2PostTransaction,
  V2Metadata,
  PaginationParams 
} from '../../types/transaction';

const API_BASE_URL = 'http://localhost:3068/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionApi = {
  // Count transactions in a ledger
  countTransactions: async (ledgerName: string): Promise<number> => {
    const response = await api.head(`/${ledgerName}/transactions`);
    return parseInt(response.headers['count'] || '0', 10);
  },

  // List transactions from a ledger
  listTransactions: async (ledgerName: string, params?: PaginationParams): Promise<V2TransactionsCursorResponse> => {
    const response = await api.get(`/${ledgerName}/transactions`, { 
      data: {}, // Empty request body as required by the API
      params 
    });
    return response.data;
  },

  // Get transaction by ID
  getTransaction: async (ledgerName: string, transactionId: number, params?: PaginationParams): Promise<V2GetTransactionResponse> => {
    const response = await api.get(`/${ledgerName}/transactions/${transactionId}`, { 
      data: {}, // Empty request body as required by the API
      params 
    });
    return response.data;
  },

  // Create a new transaction
  createTransaction: async (ledgerName: string, transaction: V2PostTransaction): Promise<V2CreateTransactionResponse> => {
    const response = await api.post(`/${ledgerName}/transactions`, transaction);
    return response.data;
  },

  // Add metadata to a transaction
  addTransactionMetadata: async (ledgerName: string, transactionId: number, metadata: V2Metadata): Promise<void> => {
    await api.post(`/${ledgerName}/transactions/${transactionId}/metadata`, metadata);
  },

  // Delete metadata by key
  deleteTransactionMetadata: async (ledgerName: string, transactionId: number, key: string): Promise<void> => {
    await api.delete(`/${ledgerName}/transactions/${transactionId}/metadata/${key}`);
  },

  // Revert a transaction
  revertTransaction: async (ledgerName: string, transactionId: number): Promise<void> => {
    await api.post(`/${ledgerName}/transactions/${transactionId}/revert`);
  },
};

// React Query hooks
export const useTransactionsCount = (ledgerName: string) => {
  return useQuery({
    queryKey: ['transactions', 'count', ledgerName],
    queryFn: () => transactionApi.countTransactions(ledgerName),
    enabled: !!ledgerName,
  });
};

export const useTransactions = (ledgerName: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['transactions', ledgerName, params],
    queryFn: () => transactionApi.listTransactions(ledgerName, params),
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

export const useTransaction = (ledgerName: string, transactionId: number, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['transaction', ledgerName, transactionId, params],
    queryFn: () => transactionApi.getTransaction(ledgerName, transactionId, params),
    enabled: !!ledgerName && !!transactionId,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (transaction not found) or 405 (method not allowed)
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, transaction }: { 
      ledgerName: string; 
      transaction: V2PostTransaction; 
    }) => transactionApi.createTransaction(ledgerName, transaction),
    onSuccess: (_, { ledgerName }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['accounts', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'count', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['accounts', 'count', ledgerName] });
    },
  });
};

export const useAddTransactionMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, transactionId, metadata }: { 
      ledgerName: string; 
      transactionId: number; 
      metadata: V2Metadata; 
    }) => transactionApi.addTransactionMetadata(ledgerName, transactionId, metadata),
    onSuccess: (_, { ledgerName, transactionId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['transaction', ledgerName, transactionId] });
    },
  });
};

export const useDeleteTransactionMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, transactionId, key }: { 
      ledgerName: string; 
      transactionId: number; 
      key: string; 
    }) => transactionApi.deleteTransactionMetadata(ledgerName, transactionId, key),
    onSuccess: (_, { ledgerName, transactionId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['transaction', ledgerName, transactionId] });
    },
  });
};

export const useRevertTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, transactionId }: { 
      ledgerName: string; 
      transactionId: number; 
    }) => transactionApi.revertTransaction(ledgerName, transactionId),
    onSuccess: (_, { ledgerName }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['accounts', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'count', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['accounts', 'count', ledgerName] });
    },
  });
}; 