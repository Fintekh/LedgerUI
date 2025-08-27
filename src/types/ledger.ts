// Ledger types based on v2 API specification

export interface V2Metadata {
  [key: string]: string;
}

export interface V2Ledger {
  name: string;
  bucket: string;
  addedAt: string;
  metadata?: V2Metadata;
}

export interface V2LedgerListResponse {
  cursor: {
    pageSize: number;
    hasMore: boolean;
    data: V2Ledger[];
  };
}

export interface V2GetLedgerResponse {
  data: V2Ledger;
}

export interface V2CreateLedgerRequest {
  metadata?: V2Metadata;
}

export interface V2UpdateLedgerMetadataRequest {
  metadata: V2Metadata;
}

export interface PaginationParams {
  pageSize?: number;
  cursor?: string;
  sort?: string;
}

// New types for balances, volumes, and logs
export interface V2Balance {
  account: string;
  asset: string;
  balance: string;
  metadata?: V2Metadata;
}

export interface V2BalancesResponse {
  data: { [asset: string]: number }; // This is the actual response structure
}

export interface V2Volume {
  account: string;
  asset: string;
  input: string;
  output: string;
  metadata?: V2Metadata;
}

export interface V2VolumesResponse {
  cursor: {
    pageSize: number;
    hasMore: boolean;
    data: V2Volume[];
  };
}

export interface V2Log {
  id: number;
  type: string;
  data: any;
  hash: string;
  date: string;
  ledger: string;
  error?: string;
}

export interface V2LogsResponse {
  cursor: {
    pageSize: number;
    hasMore: boolean;
    data: V2Log[];
  };
}

export interface V2ErrorResponse {
  errorCode: string;
  errorDescription: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: V2ErrorResponse;
} 