import { useLiveQuery } from "dexie-react-hooks";
import { useState, useCallback, useRef, useEffect } from "react";
import type { CalculationParams, CalculationResult, CalculationHistory } from "@/shared/types";
import { ErrorHandler } from "@/shared/utils/errorHandler";
import { isFieldValid, getFieldErrorMessage } from "@/shared/utils/validator";
import { DEFAULT_VALUES, UI_CONSTANTS } from "@/shared/constants";
import { calculationService } from "@/client/services/calculationService";
import { calculationRepository } from "@/client/db/calculationRepository";
import { debounce } from "es-toolkit";

const DEFAULT_PARAMS: CalculationParams = {
  initialPrice: DEFAULT_VALUES.INITIAL_PRICE,
  boardCount: DEFAULT_VALUES.BOARD_COUNT,
  dailyReturn: DEFAULT_VALUES.DAILY_RETURN,
};

export const useStockCalculator = () => {
  const [results, setResults] = useState<{ up: CalculationResult; down: CalculationResult } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const allHistoryResult = useLiveQuery(() => calculationRepository.getAll({ limit: 1000 }), []);
  const allHistory: CalculationHistory[] = allHistoryResult?.data ?? [];
  const isLoadingHistory = allHistory.length === 0;

  const paginatedHistoryResult = useLiveQuery(
    () => calculationRepository.getAll({ limit: pageSize, offset: (currentPage - 1) * pageSize }),
    [currentPage, pageSize],
  );
  const paginatedHistory = paginatedHistoryResult ?? {
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
  };

  const pagination = paginatedHistory.pagination;

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

  const handleClearHistory = useCallback(async () => {
    setIsClearing(true);
    try {
      await calculationService.clearHistory();
    } finally {
      setIsClearing(false);
    }
  }, []);

  const handleDeleteHistory = useCallback(async (ids: string[]) => {
    await calculationService.deleteHistory(ids);
  }, []);

  const debouncedCalculateRef = useRef(debounce((params: CalculationParams) => {
    void handleCalculate(params);
  }, UI_CONSTANTS.DEBOUNCE_DELAY_MS));

  useEffect(() => {
    debouncedCalculateRef.current = debounce((params: CalculationParams) => {
      void handleCalculate(params);
    }, UI_CONSTANTS.DEBOUNCE_DELAY_MS);
  }, [handleCalculate]);

  const handleValuesChange = useCallback((_changedValues: Partial<CalculationParams>, allValues: CalculationParams) => {
    setError(null);

    if (
      isFieldValid(allValues.initialPrice, "initialPrice") &&
      isFieldValid(allValues.boardCount, "boardCount") &&
      isFieldValid(allValues.dailyReturn, "dailyReturn")
    ) {
      debouncedCalculateRef.current({
        initialPrice: Number(allValues.initialPrice),
        boardCount: Number(allValues.boardCount),
        dailyReturn: Number(allValues.dailyReturn),
      });
    }
  }, []);

  const loadFromHistory = useCallback((historyItem: CalculationHistory) => {
    setResults(historyItem.results);
  }, []);

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
    openHistoryDrawer: () => {
      setHistoryDrawerVisible(true);
    },
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
  };
};
