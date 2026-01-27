import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateBidirectionalReturns } from "@/server/stockCalculator";
import type { CalculationParams, CalculationResult, CalculationHistory } from "@/shared/types";
import { ErrorHandler } from "@/shared/utils/errorHandler";
import { isFieldValid, getFieldErrorMessage } from "@/shared/utils/validator";
import { DEFAULT_VALUES, UI_CONSTANTS } from "@/shared/constants";
import { debounce } from "es-toolkit";

const DEFAULT_PARAMS: CalculationParams = {
  initialPrice: DEFAULT_VALUES.INITIAL_PRICE,
  boardCount: DEFAULT_VALUES.BOARD_COUNT,
  dailyReturn: DEFAULT_VALUES.DAILY_RETURN,
};

const saveCalculation = async (params: CalculationParams): Promise<CalculationHistory> => {
  const response = await fetch("/api/calculations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "保存计算记录失败");
  }

  return result.data;
};

const clearHistory = async (): Promise<void> => {
  const response = await fetch("/api/calculations", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "清除历史记录失败");
  }
};

const deleteHistory = async (ids: string[]): Promise<void> => {
  const response = await fetch("/api/calculations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "删除历史记录失败");
  }
};

export const useStockCalculator = () => {
  const [results, setResults] = useState<{ up: CalculationResult; down: CalculationResult } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState<CalculationParams>(DEFAULT_PARAMS);

  const queryClient = useQueryClient();

  // 获取所有历史记录（用于向后兼容）
  const { data: allHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["allCalculations"],
    queryFn: async () => {
      const response = await fetch("/api/calculations"); // 不带分页参数，获取所有数据
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "获取历史记录失败");
      }
      return Array.isArray(result.data) ? result.data : [];
    },
    staleTime: 30000, // 30秒内不算作陈旧
  });

  // 添加分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // 获取分页的历史记录
  const {
    data: paginatedHistory = {
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 50,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        offset: 0,
      },
    },
  } = useQuery({
    queryKey: ["paginatedCalculations", currentPage, pageSize],
    queryFn: async () => {
      const response = await fetch(`/api/calculations?page=${currentPage}&limit=${pageSize}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "获取历史记录失败");
      }
      return result;
    },
  });

  const pagination = paginatedHistory.pagination;

  const saveMutation = useMutation({
    mutationFn: saveCalculation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allCalculations"] });
      await queryClient.invalidateQueries({ queryKey: ["paginatedCalculations"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allCalculations"] });
      await queryClient.invalidateQueries({ queryKey: ["paginatedCalculations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allCalculations"] });
      await queryClient.invalidateQueries({ queryKey: ["paginatedCalculations"] });
    },
  });

  const calculate = (params: CalculationParams) => {
    setError(null);
    setCurrentParams(params);

    try {
      const calculationResults = calculateBidirectionalReturns(params);
      setResults(calculationResults);
      saveMutation.mutate(params);
    } catch (err) {
      const appError = ErrorHandler.handleUnknown(err);
      setError(appError.toUserMessage());
    }
  };

  const handleValuesChange = useMemo(
    () =>
      debounce((_changedValues: Partial<CalculationParams>, allValues: CalculationParams) => {
        setError(null);

        if (
          isFieldValid(allValues.initialPrice, "initialPrice") &&
          isFieldValid(allValues.boardCount, "boardCount") &&
          isFieldValid(allValues.dailyReturn, "dailyReturn")
        ) {
          calculate({
            initialPrice: Number(allValues.initialPrice),
            boardCount: Number(allValues.boardCount),
            dailyReturn: Number(allValues.dailyReturn),
          });
        }
      }, UI_CONSTANTS.DEBOUNCE_DELAY_MS),
    [calculate],
  );

  const loadFromHistory = (historyItem: CalculationHistory) => {
    setResults(historyItem.results);
  };

  // 分页控制函数
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (pagination && pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (pagination && pagination.hasPrev) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 切换页面大小时回到第一页
  };

  return {
    results,
    error,
    setError,
    history: allHistory, // 使用全部历史记录，保持向后兼容
    isLoadingHistory,
    historyDrawerVisible,
    setHistoryDrawerVisible,
    handleCalculate: calculate,
    loadFromHistory,
    clearHistory: clearMutation.mutate,
    deleteHistory: deleteMutation.mutate,
    openHistoryDrawer: () => {
      setHistoryDrawerVisible(true);
    },
    isFieldValid,
    getFieldErrorMessage,
    handleValuesChange,
    currentParams,
    isSaving: saveMutation.isPending,
    isClearing: clearMutation.isPending,
    // 分页相关
    pagination,
    currentPage,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  };
};
