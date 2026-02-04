import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Decimal from "decimal.js";
import { calculateRecovery } from "@/shared/utils/lossRecovery";

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

// 生成唯一 ID 的辅助函数
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// 持久化历史记录到 localStorage
const persistHistory = (history: RecoveryHistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.error("Failed to persist history");
  }
};

// 从 localStorage 加载历史记录
const loadPersistedHistory = (): RecoveryHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RecoveryHistoryItem[]) : [];
  } catch {
    console.error("Failed to parse history");
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
