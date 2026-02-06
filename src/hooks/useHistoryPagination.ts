import { useLiveQuery } from "dexie-react-hooks";
import { useState, useCallback } from "react";
import { calculationRepository } from "@/db/calculationRepository";

const DEFAULT_PAGINATION = {
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  offset: 0,
};

export const useHistoryPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // 获取分页历史记录
  const paginatedHistoryResult = useLiveQuery(
    () => calculationRepository.getAll({ limit: pageSize, offset: (currentPage - 1) * pageSize }),
    [currentPage, pageSize],
  );

  const pagination = paginatedHistoryResult?.pagination ?? DEFAULT_PAGINATION;
  const history = paginatedHistoryResult?.data ?? [];
  const isLoadingHistory = pagination.totalCount === 0;

  // 分页控制
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    history,
    isLoadingHistory,
    pagination,
    paginationControls: {
      currentPage,
      pageSize,
      goToPage,
      nextPage,
      prevPage,
      changePageSize,
    },
  };
};
