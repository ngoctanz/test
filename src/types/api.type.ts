export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T | null;
}

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
