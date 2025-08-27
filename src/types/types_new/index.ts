export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: string;
}

export interface Item extends BaseEntity {
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface ApiResponse<T> {
  data: T[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
  };
}
