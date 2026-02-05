import Dexie, { type EntityTable } from "dexie";

interface CalculationEntity {
  id: string;
  timestamp: number;
  initialPrice: number;
  boardCount: number;
  dailyReturn: number;
  finalPriceUp: number;
  totalReturnUp: number;
  totalGainUp: number;
  detailsUp: string;
  dailyDetailsUp: string;
  finalPriceDown: number;
  totalReturnDown: number;
  totalGainDown: number;
  detailsDown: string;
  dailyDetailsDown: string;
  keyMetricsUp?: string;
  keyMetricsDown?: string;
}

type CalculationDB = EntityTable<CalculationEntity, "id">;

class StockCalculatorDB extends Dexie {
  calculations!: CalculationDB;

  constructor() {
    super("StockCalculatorDB");
    this.version(1).stores({
      calculations: "id, timestamp, [initialPrice+boardCount+dailyReturn]",
    });
  }
}

export const db = new StockCalculatorDB();
