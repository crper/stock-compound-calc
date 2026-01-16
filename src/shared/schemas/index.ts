import { z } from "zod";

export const CalculationParamsSchema = z
  .object({
    initialPrice: z.number().min(0.01, "股价必须大于0.01元").max(1000000000, "股价必须小于10亿"),
    boardCount: z
      .number()
      .int("连板数量必须为整数")
      .min(1, "连板数量至少为1天")
      .max(365, "连板数量最多为365天"),
    dailyReturn: z.number().min(-99, "涨跌幅不能小于-99%").max(100, "涨跌幅不能大于100%"),
  })
  .refine((data) => !(data.dailyReturn <= -99 && data.initialPrice > 0), {
    message: "涨跌幅不能导致股价为零或负数",
  });

export type CalculationParams = z.infer<typeof CalculationParamsSchema>;

export const DailyDetailSchema = z.object({
  day: z.number().int().positive(),
  openPrice: z.number(),
  closePrice: z.number(),
  dailyGain: z.number(),
  dailyReturnPercent: z.number(),
});

export type DailyDetail = z.infer<typeof DailyDetailSchema>;

export const CalculationResultSchema = z.object({
  finalPrice: z.number(),
  totalReturn: z.number(),
  totalGain: z.number(),
  details: z.array(z.string()),
  dailyDetails: z.array(DailyDetailSchema),
});

export type CalculationResult = z.infer<typeof CalculationResultSchema>;

export const CalculationHistorySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  params: CalculationParamsSchema,
  results: z.object({
    up: CalculationResultSchema,
    down: CalculationResultSchema,
  }),
});

export type CalculationHistory = z.infer<typeof CalculationHistorySchema>;

export const BatchDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "至少选择一条记录"),
});

export type BatchDeleteRequest = z.infer<typeof BatchDeleteSchema>;
