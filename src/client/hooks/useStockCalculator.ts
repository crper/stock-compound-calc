import { useState } from "react";
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

const fetchCalculations = async (): Promise<CalculationHistory[]> => {
  const response = await fetch("/api/calculations");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "获取历史记录失败");
  }
  return result.data ?? [];
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

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ["calculations"],
    queryFn: fetchCalculations,
  });

  const saveMutation = useMutation({
    mutationFn: saveCalculation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calculations"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calculations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHistory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calculations"] });
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

  const handleValuesChange = debounce(
    (changedValues: Partial<CalculationParams>, allValues: CalculationParams) => {
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
    },
    UI_CONSTANTS.DEBOUNCE_DELAY_MS,
  );

  const loadFromHistory = (historyItem: CalculationHistory) => {
    setResults(historyItem.results);
  };

  return {
    results,
    error,
    setError,
    history,
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
  };
};
