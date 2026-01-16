import { Database } from "bun:sqlite";
import type { CalculationParams, CalculationHistory, CalculationResult } from "@/shared/types";

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
      UNIQUE(initial_price, board_count, daily_return)
    )
  `);

  database.run("CREATE INDEX IF NOT EXISTS idx_timestamp ON calculations(timestamp)");
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
      final_price_down, total_return_down, total_gain_down, details_down, daily_details_down
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  );

  return history;
};

export const getCalculations = (limit: number = 50): CalculationHistory[] => {
  const database = getDatabase();

  const query = database.prepare(`
    SELECT * FROM calculations 
    ORDER BY timestamp DESC 
    LIMIT ?
  `);

  const rows = query.all(limit) as DatabaseRow[];

  return rows.map((row) => ({
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
        details: JSON.parse(row.details_up),
        dailyDetails: JSON.parse(row.daily_details_up),
      },
      down: {
        finalPrice: row.final_price_down,
        totalReturn: row.total_return_down,
        totalGain: row.total_gain_down,
        details: JSON.parse(row.details_down),
        dailyDetails: JSON.parse(row.daily_details_down),
      },
    },
  }));
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
