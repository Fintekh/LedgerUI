export interface V2Metadata { [key: string]: string; }

export interface V2Posting {
  amount: number;
  asset: string;
  destination: string;
  source: string;
}

export interface V2Script {
  plain: string;
  vars?: Record<string, string>;
}

export interface V2PostTransaction {
  timestamp?: string;
  postings?: V2Posting[];
  script?: V2Script;
  runtime?: 'experimental-interpreter' | 'machine';
  reference?: string;
  metadata: V2Metadata;
  accountMetadata?: Record<string, V2Metadata>;
  force?: boolean;
}

export interface V2Transaction {
  id: number;
  timestamp: string;
  postings: V2Posting[];
  reference?: string;
  metadata: V2Metadata;
  reverted: boolean;
  revertedAt?: string;
  insertedAt?: string;
  updatedAt?: string;
  preCommitVolumes?: V2AggregatedVolumes;
  postCommitVolumes?: V2AggregatedVolumes;
  preCommitEffectiveVolumes?: V2AggregatedVolumes;
  postCommitEffectiveVolumes?: V2AggregatedVolumes;
}

export interface V2AggregatedVolumes {
  [account: string]: {
    [asset: string]: {
      input: number;
      output: number;
      balance: number;
    };
  };
}

export interface V2CreateTransactionResponse {
  data: V2Transaction[];
}

export interface V2TransactionsCursorResponse {
  cursor: {
    pageSize: number;
    hasMore: boolean;
    previous?: string;
    next?: string;
    data: V2Transaction[];
  };
}

export interface V2GetTransactionResponse {
  data: V2Transaction;
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