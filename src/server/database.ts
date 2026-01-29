import type { CalculationHistory, CalculationParams, CalculationResult } from "@/shared/types";
import { Database } from "bun:sqlite";

const safeJsonParse = <T>(json: string | null | undefined, defaultValue: T): T => {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
};

interface DatabaseRow {
  id: string;
  timestamp: number;
  initial_price: number;
  board_count: number;
  daily_return: number;
  final_price_up: number;
  total_return_up: number;
  total_gain_up: number;
  details_up: string;
  daily_details_up: string;
  final_price_down: number;
  total_return_down: number;
  total_gain_down: number;
  details_down: string;
  daily_details_down: string;
  key_metrics_up: string;
  key_metrics_down: string;
}

let db: Database | null = null;

export const getDatabase = (): Database => {
  if (!db) {
    db = new Database("calculations.db", { create: true });
    initializeDatabase(db);
  }
  return db;
};

const initializeDatabase = (database: Database): void => {
  database.run(`
    CREATE TABLE IF NOT EXISTS calculations (
      id TEXT PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      initial_price REAL NOT NULL,
      board_count INTEGER NOT NULL,
      daily_return REAL NOT NULL,
      final_price_up REAL NOT NULL,
      total_return_up REAL NOT NULL,
      total_gain_up REAL NOT NULL,
      details_up TEXT NOT NULL,
      daily_details_up TEXT NOT NULL,
      final_price_down REAL NOT NULL,
      total_return_down REAL NOT NULL,
      total_gain_down REAL NOT NULL,
      details_down TEXT NOT NULL,
      daily_details_down TEXT NOT NULL,
      key_metrics_up TEXT,
      key_metrics_down TEXT,
      UNIQUE(initial_price, board_count, daily_return)
    )
  `);

  // 添加索引以提高查询性能（仅保留最常用的）
  database.run("CREATE INDEX IF NOT EXISTS idx_timestamp ON calculations(timestamp DESC)");
};

export const saveCalculation = (
  params: CalculationParams,
  results: { up: CalculationResult; down: CalculationResult },
): CalculationHistory => {
  const database = getDatabase();

  const id = Date.now().toString();
  const timestamp = Date.now();

  const history: CalculationHistory = {
    id,
    timestamp: new Date(timestamp),
    params,
    results,
  };

  const query = database.prepare(`
    INSERT OR REPLACE INTO calculations (
      id, timestamp, initial_price, board_count, daily_return,
      final_price_up, total_return_up, total_gain_up, details_up, daily_details_up,
      final_price_down, total_return_down, total_gain_down, details_down, daily_details_down,
      key_metrics_up, key_metrics_down
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  query.run(
    id,
    timestamp,
    params.initialPrice,
    params.boardCount,
    params.dailyReturn,
    results.up.finalPrice,
    results.up.totalReturn,
    results.up.totalGain,
    JSON.stringify(results.up.details),
    JSON.stringify(results.up.dailyDetails),
    results.down.finalPrice,
    results.down.totalReturn,
    results.down.totalGain,
    JSON.stringify(results.down.details),
    JSON.stringify(results.down.dailyDetails),
    JSON.stringify(results.up.keyMetrics),
    JSON.stringify(results.down.keyMetrics),
  );

  return history;
};

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export const getCalculations = (
  options: PaginationOptions = {},
): { data: CalculationHistory[]; totalCount: number } => {
  const database = getDatabase();
  const { limit = 50, offset = 0 } = options;

  // 查询总记录数
  const countQuery = database.prepare("SELECT COUNT(*) as count FROM calculations");
  const totalCount = (countQuery.get() as { count: number }).count;

  // 查询分页数据
  const query = database.prepare(`
    SELECT * FROM calculations
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `);

  const rows = query.all(limit, offset) as DatabaseRow[];

  const data = rows.map((row) => ({
    id: row.id,
    timestamp: new Date(row.timestamp),
    params: {
      initialPrice: row.initial_price,
      boardCount: row.board_count,
      dailyReturn: row.daily_return,
    },
    results: {
      up: {
        finalPrice: row.final_price_up,
        totalReturn: row.total_return_up,
        totalGain: row.total_gain_up,
        details: safeJsonParse(row.details_up, [] as string[]),
        dailyDetails: safeJsonParse(
          row.daily_details_up,
          [] as {
            day: number;
            openPrice: number;
            closePrice: number;
            dailyGain: number;
            dailyReturnPercent: number;
          }[],
        ),
        keyMetrics: safeJsonParse(
          row.key_metrics_up,
          undefined as
            | {
                doubleDays: number | null;
                tenXDays: number | null;
                breakEvenReturn: number | null;
                annualizedReturn: number | null;
              }
            | undefined,
        ),
      },
      down: {
        finalPrice: row.final_price_down,
        totalReturn: row.total_return_down,
        totalGain: row.total_gain_down,
        details: safeJsonParse(row.details_down, [] as string[]),
        dailyDetails: safeJsonParse(
          row.daily_details_down,
          [] as {
            day: number;
            openPrice: number;
            closePrice: number;
            dailyGain: number;
            dailyReturnPercent: number;
          }[],
        ),
        keyMetrics: safeJsonParse(
          row.key_metrics_down,
          undefined as
            | {
                doubleDays: number | null;
                tenXDays: number | null;
                breakEvenReturn: number | null;
                annualizedReturn: number | null;
              }
            | undefined,
        ),
      },
    },
  }));

  return { data, totalCount };
};

export const clearCalculations = (): void => {
  const database = getDatabase();
  const query = database.prepare("DELETE FROM calculations");
  query.run();
};

export const deleteCalculation = (id: string): boolean => {
  const database = getDatabase();
  const query = database.prepare("DELETE FROM calculations WHERE id = ?");
  const result = query.run(id);

  return result.changes > 0;
};
