import { useState, useCallback, useEffect, useRef } from "react";
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
