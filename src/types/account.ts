export interface V2Metadata { [key: string]: string; }

export interface V2Account {
  address: string;
  metadata: V2Metadata;
  insertionDate?: string;
  updatedAt?: string;
  firstUsage?: string;
  volumes?: V2Volumes;
  effectiveVolumes?: V2Volumes;
}

export interface V2Volumes {
  [asset: string]: {
    input: number;
    output: number;
    balance: number;
  };
}

export interface V2AccountsCursorResponse {
  cursor: {
    pageSize: number;
    hasMore: boolean;
    previous?: string;
    next?: string;
    data: V2Account[];
  };
}

export interface V2AccountResponse {
  data: V2Account;
}

export interface V2ErrorResponse {
  errorCode: string;
  errorDescription: string;
}

export interface PaginationParams {
  pageSize?: number;
  cursor?: string;
  sort?: string;
  expand?: string;
  pit?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: V2ErrorResponse;
} 