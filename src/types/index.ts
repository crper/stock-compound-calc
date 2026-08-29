// 从 schemas 重新导出所有类型，保持单一数据源
export type * from "@/schemas";

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  offset: number;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: PaginationMeta;
}
