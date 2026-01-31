/**
 * 数据库类型定义
 */

export interface DatabaseRow {
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

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}
