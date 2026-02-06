import { useLiveQuery } from "dexie-react-hooks";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import type { CalculationParams, CalculationResult, CalculationHistory } from "@/types";
import { ErrorHandler } from "@/utils/errorHandler";
import { isFieldValid, getFieldErrorMessage } from "@/utils/validator";
import { DEFAULT_VALUES, UI_CONSTANTS } from "@/constants";
import { calculationService } from "@/services/calculationService";
import { calculationRepository } from "@/db/calculationRepository";
import { debounce } from "es-toolkit";

const DEFAULT_PARAMS: CalculationParams = {
  initialPrice: DEFAULT_VALUES.INITIAL_PRICE,
  boardCount: DEFAULT_VALUES.BOARD_COUNT,
  dailyReturn: DEFAULT_VALUES.DAILY_RETURN,
};

// 默认分页对象
const DEFAULT_PAGINATION = {
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  offset: 0,
};

export const useStockCalculator = () => {
  const [results, setResults] = useState<{ up: CalculationResult; down: CalculationResult } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // 使用 App.useApp() 获取带上下文的消息实例
  const { message } = App.useApp();
  const { t } = useTranslation();

  // 获取全部历史记录
  const allHistoryResult = useLiveQuery(() => calculationRepository.getAll({ limit: 1000 }), []);
  const allHistory: CalculationHistory[] = allHistoryResult?.data ?? [];
  const isLoadingHistory = allHistory.length === 0;

  // 获取分页历史记录
  const paginatedHistoryResult = useLiveQuery(
    () => calculationRepository.getAll({ limit: pageSize, offset: (currentPage - 1) * pageSize }),
    [currentPage, pageSize],
  );

  const pagination = paginatedHistoryResult?.pagination ?? DEFAULT_PAGINATION;

  // 防抖计算函数 ref
  const debouncedCalculateRef = useRef(
    debounce((params: CalculationParams, calculateFn: (p: CalculationParams) => Promise<void>) => {
      void calculateFn(params);
    }, UI_CONSTANTS.DEBOUNCE_DELAY_MS),
  );

  // 计算处理函数
  const handleCalculate = useCallback(async (params: CalculationParams) => {
    setError(null);
    setIsCalculating(true);
    setCurrentParams(params);

    try {
      const calcResults = await calculationService.calculate(params);
      setResults(calcResults);
      setIsSaving(true);
      await calculationService.saveCalculation(params, calcResults);
    } catch (err) {
      setError(ErrorHandler.handleUnknown(err).toUserMessage());
    } finally {
      setIsSaving(false);
      setIsCalculating(false);
    }
  }, []);

  // 清理 effect
  useEffect(() => {
    return () => {
      debouncedCalculateRef.current.cancel?.();
    };
  }, []);

  // 清空历史
  const handleClearHistory = useCallback(async () => {
    setIsClearing(true);
    try {
      await calculationService.clearHistory();
      message.success(t("common.messages.clearSuccess"));
    } catch (error) {
      const appError = ErrorHandler.handleUnknown(error);
      ErrorHandler.log(appError);
      message.error(t("common.messages.clearFailed"));
    } finally {
      setIsClearing(false);
    }
  }, [message, t]);

  // 删除历史
  const handleDeleteHistory = useCallback(async (ids: string[]) => {
    await calculationService.deleteHistory(ids);
  }, []);

  // 处理表单值变化
  const handleValuesChange = useCallback(
    (_changedValues: Partial<CalculationParams>, allValues: CalculationParams) => {
      setError(null);

      const params: CalculationParams = {
        initialPrice: Number(allValues.initialPrice),
        boardCount: Number(allValues.boardCount),
        dailyReturn: Number(allValues.dailyReturn),
        stockQuantity: allValues.stockQuantity ? Number(allValues.stockQuantity) : undefined,
      };

      if (
        isFieldValid(params.initialPrice, "initialPrice") &&
        isFieldValid(params.boardCount, "boardCount") &&
        isFieldValid(params.dailyReturn, "dailyReturn")
      ) {
        debouncedCalculateRef.current(params, handleCalculate);
      }
    },
    [handleCalculate],
  );

  // 从历史记录加载
  const loadFromHistory = useCallback((historyItem: CalculationHistory) => {
    setResults(historyItem.results);
  }, []);

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

  // 打开历史抽屉
  const openHistoryDrawer = useCallback(() => {
    setHistoryDrawerVisible(true);
  }, []);

  // 使用 useMemo 缓存返回值
  return useMemo(
    () => ({
      results,
      error,
      setError,
      history: allHistory,
      isLoadingHistory,
      historyDrawerVisible,
      setHistoryDrawerVisible,
      handleCalculate,
      loadFromHistory,
      clearHistory: handleClearHistory,
      deleteHistory: handleDeleteHistory,
      openHistoryDrawer,
      isFieldValid,
      getFieldErrorMessage,
      handleValuesChange,
      currentParams,
      isSaving,
      isClearing,
      isCalculating,
      pagination,
      currentPage,
      pageSize,
      goToPage,
      nextPage,
      prevPage,
      changePageSize,
    }),
    [
      results,
      error,
      allHistory,
      isLoadingHistory,
      historyDrawerVisible,
      handleCalculate,
      loadFromHistory,
      handleClearHistory,
      handleDeleteHistory,
      openHistoryDrawer,
      handleValuesChange,
      currentParams,
      isSaving,
      isClearing,
      isCalculating,
      pagination,
      currentPage,
      pageSize,
      goToPage,
      nextPage,
      prevPage,
      changePageSize,
    ],
  );
};
