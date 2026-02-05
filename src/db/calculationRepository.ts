import { db, type CalculationEntity } from "./dexie";
import type { CalculationHistory, CalculationParams, PaginatedData } from "@/types";

const safeJsonParse = <T>(json: string | undefined, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
};

const entityToHistory = (row: CalculationEntity): CalculationHistory => ({
  id: row.id,
  timestamp: new Date(row.timestamp),
  params: {
    initialPrice: row.initialPrice,
    boardCount: row.boardCount,
    dailyReturn: row.dailyReturn,
  },
  results: {
    up: {
      finalPrice: row.finalPriceUp,
      totalReturn: row.totalReturnUp,
      totalGain: row.totalGainUp,
      details: safeJsonParse(row.detailsUp, []),
      dailyDetails: safeJsonParse(row.dailyDetailsUp, []),
      keyMetrics: safeJsonParse(row.keyMetricsUp, undefined),
    },
    down: {
      finalPrice: row.finalPriceDown,
      totalReturn: row.totalReturnDown,
      totalGain: row.totalGainDown,
      details: safeJsonParse(row.detailsDown, []),
      dailyDetails: safeJsonParse(row.dailyDetailsDown, []),
      keyMetrics: safeJsonParse(row.keyMetricsDown, undefined),
    },
  },
});

export const calculationRepository = {
  async save(
    params: CalculationParams,
    results: { up: any; down: any },
  ): Promise<CalculationHistory> {
    const id = Date.now().toString();
    const timestamp = Date.now();

    await db.calculations.put({
      id,
      timestamp,
      initialPrice: params.initialPrice,
      boardCount: params.boardCount,
      dailyReturn: params.dailyReturn,
      finalPriceUp: results.up.finalPrice,
      totalReturnUp: results.up.totalReturn,
      totalGainUp: results.up.totalGain,
      detailsUp: JSON.stringify(results.up.details),
      dailyDetailsUp: JSON.stringify(results.up.dailyDetails),
      finalPriceDown: results.down.finalPrice,
      totalReturnDown: results.down.totalReturn,
      totalGainDown: results.down.totalGain,
      detailsDown: JSON.stringify(results.down.details),
      dailyDetailsDown: JSON.stringify(results.down.dailyDetails),
      keyMetricsUp: JSON.stringify(results.up.keyMetrics),
      keyMetricsDown: JSON.stringify(results.down.keyMetrics),
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
