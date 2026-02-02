import { useState, useCallback, useEffect, useRef } from "react";
import Decimal from "decimal.js";

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

export const useLossRecovery = () => {
  const [lossPercent, setLossPercent] = useState<number>(20);
  const [history, setHistory] = useState<RecoveryHistoryItem[]>([]);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RecoveryHistoryItem[];
        setHistory(parsed);
      } catch {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveHistory = useCallback(
    (loss: number, gain: Decimal, mult: Decimal) => {
      const newItem: RecoveryHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lossPercent: loss,
        requiredGain: gain.isFinite() ? gain.toFixed(2) : "∞",
        multiplier: mult.isFinite() ? mult.toFixed(2) : "∞",
        timestamp: Date.now(),
        createdAt: new Date().toLocaleString("zh-CN"),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const handleLossChange = useCallback(
    (value: number) => {
      const clampedValue = Math.max(0, Math.min(99.9, value));
      setLossPercent(clampedValue);

      // 清除之前的定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 设置新的防抖定时器，用户停止操作后才保存
      debounceTimerRef.current = setTimeout(() => {
        const lossDecimal = new Decimal(clampedValue).div(100);
        let requiredGain: Decimal;
        let multiplier: Decimal;

        if (clampedValue >= 100) {
          requiredGain = new Decimal(Infinity);
          multiplier = new Decimal(Infinity);
        } else {
          requiredGain = lossDecimal.div(new Decimal(1).minus(lossDecimal)).mul(100);
          multiplier = new Decimal(1).div(new Decimal(1).minus(lossDecimal));
        }

        saveHistory(clampedValue, requiredGain, multiplier);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  return {
    lossPercent,
    history,
    historyDrawerVisible,
    setHistoryDrawerVisible,
    handleLossChange,
    clearHistory,
    deleteHistory,
    loadFromHistory,
    openHistoryDrawer,
  };
};
