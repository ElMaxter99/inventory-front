export interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    details?: unknown;
  } | null;
  meta?: Record<string, unknown> | null;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}
