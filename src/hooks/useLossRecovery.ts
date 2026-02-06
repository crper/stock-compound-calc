import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Decimal from "decimal.js";
import { calculateRecovery } from "@/utils/lossRecovery";
import { ErrorHandler, ErrorFactory } from "@/utils/errorHandler";
import { generateId } from "@/utils/idGenerator";

const STORAGE_KEY = "loss-recovery-history";
const MAX_HISTORY_ITEMS = 50;
const DEBOUNCE_DELAY = 800; // 防抖延迟，用户停止操作 800ms 后才保存

export interface RecoveryHistoryItem {
  id: string;
  lossPercent: number;
  requiredGain: string;
  multiplier: string;
  timestamp: number;
  createdAt: string;
}

// 持久化历史记录到 localStorage
const persistHistory = (history: RecoveryHistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    const appError = ErrorHandler.handleUnknown(error);
    ErrorHandler.log(appError);

    // 检查是否是存储配额溢出错误
    if (
      error instanceof Error &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      console.warn("localStorage 配额已满，部分历史记录可能无法保存。建议清空历史记录。");
      // 尝试清除旧数据并保存最新的记录
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
      } catch {
        ErrorHandler.log(ErrorFactory.system("无法保存历史记录：存储空间不足"));
      }
    }
  }
};

// 从 localStorage 加载历史记录
const loadPersistedHistory = (): RecoveryHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored) as RecoveryHistoryItem[];
    } catch {
      ErrorHandler.log(ErrorHandler.handleUnknown(new Error("历史记录数据损坏，已重置")));
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  } catch (error) {
    ErrorHandler.log(ErrorHandler.handleUnknown(error));
    return [];
  }
};

export const useLossRecovery = () => {
  const [lossPercent, setLossPercent] = useState<number>(20);
  const [history, setHistory] = useState<RecoveryHistoryItem[]>([]);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 从 localStorage 加载历史记录 - 只在挂载时执行一次
  useEffect(() => {
    const stored = loadPersistedHistory();
    if (stored.length > 0) {
      setHistory(stored);
    }
  }, []);

  // 清理定时器的 effect
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 保存历史记录 - 使用 useCallback 但依赖数组为空
  const saveHistory = useCallback((loss: number, gain: Decimal, mult: Decimal) => {
    const newItem: RecoveryHistoryItem = {
      id: generateId(),
      lossPercent: loss,
      requiredGain: gain.isFinite() ? gain.toFixed(2) : "∞",
      multiplier: mult.isFinite() ? mult.toFixed(2) : "∞",
      timestamp: Date.now(),
      createdAt: new Date().toLocaleString("zh-CN"),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      persistHistory(updated);
      return updated;
    });
  }, []);

  // 处理亏损百分比变化 - 带防抖
  const handleLossChange = useCallback(
    (value: number) => {
      const clampedValue = Math.max(0, Math.min(99.9, value));
      setLossPercent(clampedValue);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const metrics = calculateRecovery(clampedValue);
        saveHistory(clampedValue, metrics.requiredGain, metrics.multiplier);
      }, DEBOUNCE_DELAY);
    },
    [saveHistory],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const deleteHistory = useCallback((ids: string[]) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => !ids.includes(item.id));
      persistHistory(updated);
      return updated;
    });
  }, []);

  const loadFromHistory = useCallback((item: RecoveryHistoryItem) => {
    setLossPercent(item.lossPercent);
    setHistoryDrawerVisible(false);
  }, []);

  const openHistoryDrawer = useCallback(() => {
    setHistoryDrawerVisible(true);
  }, []);

  const closeHistoryDrawer = useCallback(() => {
    setHistoryDrawerVisible(false);
  }, []);

  // 使用 useMemo 缓存返回值，避免不必要的对象重建
  return useMemo(
    () => ({
      lossPercent,
      history,
      historyDrawerVisible,
      setHistoryDrawerVisible,
      handleLossChange,
      clearHistory,
      deleteHistory,
      loadFromHistory,
      openHistoryDrawer,
      closeHistoryDrawer,
    }),
    [
      lossPercent,
      history,
      historyDrawerVisible,
      handleLossChange,
      clearHistory,
      deleteHistory,
      loadFromHistory,
      openHistoryDrawer,
      closeHistoryDrawer,
    ],
  );
};
