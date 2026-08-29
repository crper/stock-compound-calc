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
  dailyDetailsUp: string;
  positionValueUp?: string;
  positionGainUp?: number;
  finalPriceDown: number;
  totalReturnDown: number;
  totalGainDown: number;
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
    this.version(2).stores({
      // 添加 [timestamp+dailyReturn] 复合索引，优化按日期范围和涨跌幅筛选的查询性能
      calculations: "id, timestamp, [initialPrice+boardCount+dailyReturn], [timestamp+dailyReturn]",
    });
  }
}

export const db = new StockCalculatorDB();
