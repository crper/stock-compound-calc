import { db, type CalculationEntity } from "./dexie";
import { z } from "zod";
import {
  DailyDetailSchema,
  KeyMetricsSchema,
  PositionValueSchema,
  type CalculationHistory,
  type CalculationParams,
  type CalculationResult,
  type DailyDetail,
  type KeyMetrics,
  type PositionValue,
} from "@/schemas";
import type { PaginatedData } from "@/types";
import { generateId } from "@/utils/idGenerator";

// JSON 反序列化统一走 Zod 校验：IndexedDB 属于持久化存储，
// 结构可能因历史版本/手改而损坏，直接 JSON.parse as T 是不安全的
const safeJsonParse = <T>(json: string | undefined, schema: z.ZodType<T>, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    const parsed: unknown = JSON.parse(json);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : defaultValue;
  } catch {
    return defaultValue;
  }
};

const parseDailyDetails = (json: string | undefined): DailyDetail[] =>
  safeJsonParse(json, z.array(DailyDetailSchema), []);

const parseKeyMetrics = (json: string | undefined): KeyMetrics | undefined =>
  safeJsonParse(json, KeyMetricsSchema.optional(), undefined);

const parsePositionValue = (json: string | undefined): PositionValue | undefined =>
  safeJsonParse(json, PositionValueSchema.optional(), undefined);

const entityToHistory = (row: CalculationEntity): CalculationHistory => ({
  id: row.id,
  timestamp: new Date(row.timestamp),
  params: {
    initialPrice: row.initialPrice,
    boardCount: row.boardCount,
    dailyReturn: row.dailyReturn,
    stockQuantity: row.stockQuantity,
  },
  results: {
    up: {
      finalPrice: row.finalPriceUp,
      totalReturn: row.totalReturnUp,
      totalGain: row.totalGainUp,
      dailyDetails: parseDailyDetails(row.dailyDetailsUp),
      keyMetrics: parseKeyMetrics(row.keyMetricsUp),
      positionValue: parsePositionValue(row.positionValueUp),
      positionGain: row.positionGainUp,
    },
    down: {
      finalPrice: row.finalPriceDown,
      totalReturn: row.totalReturnDown,
      totalGain: row.totalGainDown,
      dailyDetails: parseDailyDetails(row.dailyDetailsDown),
      keyMetrics: parseKeyMetrics(row.keyMetricsDown),
      positionValue: parsePositionValue(row.positionValueDown),
      positionGain: row.positionGainDown,
    },
  },
});

export const calculationRepository = {
  async save(
    params: CalculationParams,
    results: { up: CalculationResult; down: CalculationResult },
  ): Promise<CalculationHistory> {
    const id = generateId();
    const timestamp = Date.now();

    await db.calculations.put({
      id,
      timestamp,
      initialPrice: params.initialPrice,
      boardCount: params.boardCount,
      dailyReturn: params.dailyReturn,
      stockQuantity: params.stockQuantity,
      finalPriceUp: results.up.finalPrice,
      totalReturnUp: results.up.totalReturn,
      totalGainUp: results.up.totalGain,
      dailyDetailsUp: JSON.stringify(results.up.dailyDetails),
      positionValueUp: JSON.stringify(results.up.positionValue),
      positionGainUp: results.up.positionGain,
      finalPriceDown: results.down.finalPrice,
      totalReturnDown: results.down.totalReturn,
      totalGainDown: results.down.totalGain,
      dailyDetailsDown: JSON.stringify(results.down.dailyDetails),
      keyMetricsUp: JSON.stringify(results.up.keyMetrics),
      keyMetricsDown: JSON.stringify(results.down.keyMetrics),
      positionValueDown: JSON.stringify(results.down.positionValue),
      positionGainDown: results.down.positionGain,
    });

    return {
      id,
      timestamp: new Date(timestamp),
      params,
      results,
    };
  },

  async getAll(
    options: { limit?: number; offset?: number } = {},
  ): Promise<PaginatedData<CalculationHistory>> {
    const { limit = 50, offset = 0 } = options;

    const totalCount = await db.calculations.count();
    const rows = await db.calculations
      .orderBy("timestamp")
      // oxlint-disable-next-line unicorn/no-array-reverse -- 这是 Dexie Collection 的 reverse()（数据库降序查询），并非 Array.prototype.reverse
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();

    return {
      data: rows.map(entityToHistory),
      pagination: {
        currentPage: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
        offset,
      },
    };
  },

  async delete(id: string): Promise<boolean> {
    const count = await db.calculations.where("id").equals(id).delete();
    return count > 0;
  },

  async deleteMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    return await db.calculations.where("id").anyOf(ids).delete();
  },

  async clear(): Promise<void> {
    await db.calculations.clear();
  },
};
