import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  V2Ledger,
  V2LedgerListResponse,
  V2GetLedgerResponse,
  V2CreateLedgerRequest,
  V2UpdateLedgerMetadataRequest,
  V2BalancesResponse,
  V2VolumesResponse,
  V2LogsResponse,
  PaginationParams,
} from '../../types/ledger';

// API base configuration
const API_BASE_URL = 'http://localhost:3068/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const ledgerApi = {
  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await api.get('/_/info', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // List ledgers
  listLedgers: async (params?: PaginationParams): Promise<V2LedgerListResponse> => {
    try {
      console.log('Fetching ledgers with params:', params);
      const response = await api.get('/', {
        params: {
          pageSize: params?.pageSize || 15,
          cursor: params?.cursor,
          sort: params?.sort,
        },
        timeout: 10000, // 10 second timeout
      });
      console.log('Ledgers response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch ledgers:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response?.status === 404) {
        // Return empty response for 404 instead of throwing
        return {
          cursor: {
            pageSize: params?.pageSize || 15,
            hasMore: false,
            data: []
          }
        };
      }
      throw new Error(`Failed to load ledgers: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Get a specific ledger
  getLedger: async (ledgerName: string): Promise<V2GetLedgerResponse> => {
    try {
      const response = await api.get(`/${ledgerName}`, {
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch ledger:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw new Error(`Failed to load ledger: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Create a new ledger
  createLedger: async (ledgerName: string, data: V2CreateLedgerRequest): Promise<void> => {
    try {
      await api.post(`/${ledgerName}`, data, {
        timeout: 10000,
      });
    } catch (error: any) {
      console.error('Failed to create ledger:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw new Error(`Failed to create ledger: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Update ledger metadata
  updateLedgerMetadata: async (ledgerName: string, metadata: V2UpdateLedgerMetadataRequest): Promise<void> => {
    try {
      await api.put(`/${ledgerName}/metadata`, metadata, {
        timeout: 10000,
      });
    } catch (error: any) {
      console.error('Failed to update ledger metadata:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw new Error(`Failed to update ledger metadata: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Delete metadata by key
  deleteLedgerMetadata: async (ledgerName: string, key: string): Promise<void> => {
    try {
      await api.delete(`/${ledgerName}/metadata/${key}`, {
        timeout: 10000,
      });
    } catch (error: any) {
      console.error('Failed to delete ledger metadata:', ledgerName, key, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      throw new Error(`Failed to delete ledger metadata: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Get aggregated balances
  getBalances: async (ledgerName: string): Promise<V2BalancesResponse> => {
    try {
      const response = await api.get(`/${ledgerName}/aggregate/balances`, {
        data: {}, // Required request body
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch balances:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response?.status === 404) {
        return {
          data: {}
        };
      }
      throw new Error(`Failed to load balances: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Get volumes
  getVolumes: async (ledgerName: string, params?: PaginationParams): Promise<V2VolumesResponse> => {
    try {
      const response = await api.get(`/${ledgerName}/volumes`, {
        params: {
          pageSize: params?.pageSize || 15,
          cursor: params?.cursor,
          sort: params?.sort,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch volumes:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response?.status === 404) {
        return {
          cursor: {
            pageSize: params?.pageSize || 15,
            hasMore: false,
            data: []
          }
        };
      }
      throw new Error(`Failed to load volumes: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },

  // Get logs
  getLogs: async (ledgerName: string, params?: PaginationParams): Promise<V2LogsResponse> => {
    try {
      const response = await api.get(`/${ledgerName}/logs`, {
        params: {
          pageSize: params?.pageSize || 15,
          cursor: params?.cursor,
          sort: params?.sort,
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch logs:', ledgerName, error);
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_EMPTY_RESPONSE') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response?.status === 404) {
        return {
          cursor: {
            pageSize: params?.pageSize || 15,
            hasMore: false,
            data: []
          }
        };
      }
      throw new Error(`Failed to load logs: ${error.response?.data?.errorMessage || error.message || 'Unknown error'}`);
    }
  },
};

// React Query hooks
export const useLedgers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['ledgers', params],
    queryFn: () => ledgerApi.listLedgers(params),
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on network errors or empty responses
      if (error?.message?.includes('Unable to connect to the server')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useLedger = (ledgerName: string) => {
  return useQuery({
    queryKey: ['ledger', ledgerName],
    queryFn: () => ledgerApi.getLedger(ledgerName),
    enabled: !!ledgerName,
    staleTime: 30000,
    retry: (failureCount, error: any) => {
      // Don't retry on network errors or empty responses
      if (error?.message?.includes('Unable to connect to the server')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateLedger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, data }: { ledgerName: string; data: V2CreateLedgerRequest }) =>
      ledgerApi.createLedger(ledgerName, data),
    onSuccess: () => {
      // Invalidate and refetch ledgers list
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
    },
  });
};

export const useUpdateLedgerMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, metadata }: { ledgerName: string; metadata: V2UpdateLedgerMetadataRequest }) =>
      ledgerApi.updateLedgerMetadata(ledgerName, metadata),
    onSuccess: (_, { ledgerName }) => {
      // Invalidate specific ledger and ledgers list
      queryClient.invalidateQueries({ queryKey: ['ledger', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
    },
  });
};

export const useDeleteLedgerMetadata = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ledgerName, key }: { ledgerName: string; key: string }) =>
      ledgerApi.deleteLedgerMetadata(ledgerName, key),
    onSuccess: (_, { ledgerName }) => {
      queryClient.invalidateQueries({ queryKey: ['ledger', ledgerName] });
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
    },
  });
};

// React Query hooks for balances, volumes, and logs
export const useBalances = (ledgerName: string) => {
  return useQuery({
    queryKey: ['balances', ledgerName],
    queryFn: () => ledgerApi.getBalances(ledgerName),
    enabled: !!ledgerName,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Unable to connect to the server')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useVolumes = (ledgerName: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['volumes', ledgerName, params],
    queryFn: () => ledgerApi.getVolumes(ledgerName, params),
    enabled: !!ledgerName,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Unable to connect to the server')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useLogs = (ledgerName: string, params?: PaginationParams) => {
  return useQuery({
    queryKey: ['logs', ledgerName, params],
    queryFn: () => ledgerApi.getLogs(ledgerName, params),
    enabled: !!ledgerName,
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Unable to connect to the server')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 