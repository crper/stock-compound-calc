import Dexie, { type EntityTable } from "dexie";

export interface CalculationEntity {
  id: string;
  timestamp: number;
  initialPrice: number;
  boardCount: number;
  dailyReturn: number;
  stockQuantity?: number;
  finalPriceUp: number;
  totalReturnUp: number;
  totalGainUp: number;
  detailsUp: string;
  dailyDetailsUp: string;
  positionValueUp?: string;
  positionGainUp?: number;
  finalPriceDown: number;
  totalReturnDown: number;
  totalGainDown: number;
  detailsDown: string;
  dailyDetailsDown: string;
  keyMetricsUp?: string;
  keyMetricsDown?: string;
  positionValueDown?: string;
  positionGainDown?: number;
}

type CalculationDB = EntityTable<CalculationEntity, "id">;

export class StockCalculatorDB extends Dexie {
  calculations!: CalculationDB;

  constructor() {
    super("StockCalculatorDB");
    this.version(1).stores({
      calculations: "id, timestamp, [initialPrice+boardCount+dailyReturn]",
    });
  }
}

export const db = new StockCalculatorDB();
