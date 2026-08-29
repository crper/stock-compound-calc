import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import type { CalculationParams, CalculationResult, CalculationHistory } from "@/types";
import { ErrorHandler } from "@/utils/errorHandler";
import { isFieldValid } from "@/utils/validator";
import { DEFAULT_VALUES, UI_CONSTANTS } from "@/constants";
import { calculationService } from "@/services/calculationService";
import { calculateBidirectionalReturns } from "@/utils/stockCalculator";
import { debounce } from "es-toolkit";
import { useHistoryPagination } from "./useHistoryPagination";

const DEFAULT_PARAMS: CalculationParams = {
  initialPrice: DEFAULT_VALUES.INITIAL_PRICE,
  boardCount: DEFAULT_VALUES.BOARD_COUNT,
  dailyReturn: DEFAULT_VALUES.DAILY_RETURN,
};

// 首屏默认值同步算出，避免挂载后再 setState 造成二次渲染与首屏空状态闪烁
const computeInitialResults = (): { up: CalculationResult; down: CalculationResult } | null => {
  try {
    return calculateBidirectionalReturns(DEFAULT_PARAMS);
  } catch (error) {
    ErrorHandler.log(ErrorHandler.handleUnknown(error));
    return null;
  }
};

export const useStockCalculator = () => {
  const [results, setResults] = useState<{ up: CalculationResult; down: CalculationResult } | null>(
    computeInitialResults,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState<CalculationParams>(DEFAULT_PARAMS);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // 使用 App.useApp() 获取带上下文的消息实例
  const { message } = App.useApp();
  const { t } = useTranslation();

  // 使用分页历史 Hook
  const { history, isLoadingHistory, pagination, paginationControls } = useHistoryPagination();

  // 防抖计算函数 ref
  const debouncedCalculateRef = useRef(
    debounce((params: CalculationParams, calculateFn: (p: CalculationParams) => Promise<void>) => {
      void calculateFn(params);
    }, UI_CONSTANTS.DEBOUNCE_DELAY_MS),
  );

  // 计算处理函数
  const handleCalculate = useCallback(async (params: CalculationParams) => {
    setErrorMessage(null);
    setIsCalculating(true);
    setCurrentParams(params);

    try {
      // calculate 为纯同步计算，无需 await
      const calcResults = calculationService.calculate(params);
      setResults(calcResults);
      setIsSaving(true);
      await calculationService.saveCalculation(params, calcResults);
    } catch (error) {
      setErrorMessage(ErrorHandler.handleUnknown(error).toUserMessage());
    } finally {
      setIsSaving(false);
      setIsCalculating(false);
    }
  }, []);

  // 清理 effect：先把 ref 快照到局部变量，避免 cleanup 读到已变更的 ref
  useEffect(() => {
    const debouncedCalculate = debouncedCalculateRef.current;
    return () => {
      debouncedCalculate.cancel?.();
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

  // 删除历史：错误处理收敛在 hook 内（toast + 日志），失败时 resolve，调用方仅在成功后提示
  const handleDeleteHistory = useCallback(
    async (ids: string[]) => {
      try {
        await calculationService.deleteHistory(ids);
      } catch (error) {
        const appError = ErrorHandler.handleUnknown(error);
        ErrorHandler.log(appError);
        message.error(t("common.messages.deleteFailed"));
      }
    },
    [message, t],
  );

  // 处理表单值变化
  const handleValuesChange = useCallback(
    (_changedValues: Partial<CalculationParams>, allValues: CalculationParams) => {
      setErrorMessage(null);

      const params: CalculationParams = {
        initialPrice: allValues.initialPrice,
        boardCount: allValues.boardCount,
        dailyReturn: allValues.dailyReturn,
        stockQuantity: allValues.stockQuantity,
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

  // 从历史记录加载：结果与参数必须同步更新，否则结果面板展示的 params 与结果不一致
  const loadFromHistory = useCallback((historyItem: CalculationHistory) => {
    setResults(historyItem.results);
    setCurrentParams(historyItem.params);
  }, []);

  // 打开历史抽屉
  const openHistoryDrawer = useCallback(() => {
    setHistoryDrawerVisible(true);
  }, []);

  // 使用 useMemo 缓存返回值，减少依赖数组长度
  return useMemo(
    () => ({
      results,
      errorMessage,
      setErrorMessage,
      history,
      isLoadingHistory,
      historyDrawerVisible,
      setHistoryDrawerVisible,
      handleCalculate,
      loadFromHistory,
      clearHistory: handleClearHistory,
      deleteHistory: handleDeleteHistory,
      openHistoryDrawer,
      handleValuesChange,
      currentParams,
      isSaving,
      isClearing,
      isCalculating,
      pagination,
      ...paginationControls, // 展开 paginationControls: currentPage, pageSize, goToPage, nextPage, prevPage, changePageSize
    }),
    [
      results,
      errorMessage,
      history,
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
      paginationControls,
    ],
  );
};
