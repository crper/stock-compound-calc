import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { debounce } from "es-toolkit";
import type Decimal from "decimal.js";
import { useTranslation } from "react-i18next";
import { z } from "zod";
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

// 运行时校验 schema：localStorage 数据不可信，读取时用 zod 逐字段校验
const RecoveryHistoryItemSchema = z.object({
  id: z.string(),
  lossPercent: z.number(),
  requiredGain: z.string(),
  multiplier: z.string(),
  timestamp: z.number(),
  createdAt: z.string(),
});

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
      const result = RecoveryHistoryItemSchema.array().safeParse(JSON.parse(stored));
      if (result.success) return result.data;
      throw new Error("invalid history data");
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
  const { i18n } = useTranslation();
  const [lossPercent, setLossPercent] = useState<number>(20);
  // 首屏直接用 localStorage 惰性初始化，避免挂载后再 setState 触发二次渲染
  const [history, setHistory] = useState<RecoveryHistoryItem[]>(loadPersistedHistory);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);

  // 保存历史记录 - 使用 useCallback 但依赖数组为空
  const saveHistory = useCallback(
    (loss: number, gain: Decimal, mult: Decimal) => {
      const newItem: RecoveryHistoryItem = {
        id: generateId(),
        lossPercent: loss,
        requiredGain: gain.isFinite() ? gain.toFixed(2) : "∞",
        multiplier: mult.isFinite() ? mult.toFixed(2) : "∞",
        timestamp: Date.now(),
        createdAt: new Date().toLocaleString(i18n.language),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
        persistHistory(updated);
        return updated;
      });
    },
    [i18n.language],
  );

  // saveHistory 依赖 i18n.language 会重建，用 ref 转发最新引用（在 effect 中更新，避免渲染期写 ref）
  const saveHistoryRef = useRef(saveHistory);
  useEffect(() => {
    saveHistoryRef.current = saveHistory;
  }, [saveHistory]);

  // 与 useStockCalculator 统一使用 es-toolkit debounce；最新 saveHistory 由调用方传入
  const debouncedSaveRef = useRef(
    debounce((loss: number, saveFn: (loss: number, gain: Decimal, mult: Decimal) => void) => {
      const metrics = calculateRecovery(loss);
      saveFn(loss, metrics.requiredGain, metrics.multiplier);
    }, DEBOUNCE_DELAY),
  );

  // 卸载时取消未触发的防抖保存
  useEffect(() => {
    const debouncedSave = debouncedSaveRef.current;
    return () => {
      debouncedSave.cancel();
    };
  }, []);

  // 处理亏损百分比变化 - 带防抖
  const handleLossChange = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(99.9, value));
    setLossPercent(clampedValue);
    debouncedSaveRef.current(clampedValue, saveHistoryRef.current);
  }, []);

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
