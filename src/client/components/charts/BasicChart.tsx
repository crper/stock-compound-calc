/**
 * 基础图表组件
 * 使用 Recharts 实现柱状图和曲线图
 */
import { Empty } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useMemo } from "react";
import type { CalculationResult } from "@/shared/types";
import { formatCurrency } from "@/shared/utils/formatters";
import type { ChartType } from "./ChartTypeSelector";

interface ChartDataType {
  day: string;
  涨停: number;
  跌停: number;
}

interface BasicChartProps {
  results: { up: CalculationResult; down: CalculationResult };
  isMobile: boolean;
  chartType?: ChartType;
}

const MAX_DATA_POINTS = 50;

const getChartData = (
  results: { up: CalculationResult; down: CalculationResult } | undefined,
): ChartDataType[] => {
  if (!results) {
    return [];
  }

  const maxLength = Math.max(results.up.dailyDetails.length, results.down.dailyDetails.length);
  const data: ChartDataType[] = [];

  for (let i = 0; i < Math.min(maxLength, MAX_DATA_POINTS); i++) {
    const upDetail = results.up.dailyDetails[i];
    const downDetail = results.down.dailyDetails[i];

    data.push({
      day: `${i + 1}`,
      涨停: upDetail?.closePrice ?? 0,
      跌停: downDetail?.closePrice ?? 0,
    });
  }

  return data;
};

const getChartConfig = (isMobile: boolean) => ({
  height: isMobile ? 300 : 400,
  tickFontSize: isMobile ? 10 : 12,
  barSize: isMobile ? 8 : 12,
  lineWidth: isMobile ? 2 : 3,
});

export const BasicChart: React.FC<BasicChartProps> = React.memo(({ results, isMobile, chartType = "BAR" }) => {
  const chartData = useMemo(() => getChartData(results), [results]);
  const config = useMemo(() => getChartConfig(isMobile), [isMobile]);

  if (chartData.length === 0) {
    return (
      <div className="p-10 text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[400px] flex items-center justify-center">
        <Empty description="暂无数据" />
      </div>
    );
  }

  const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />;
  const commonXAxis = <XAxis dataKey="day" tick={{ fill: "#999", fontSize: config.tickFontSize }} tickLine={{ stroke: "#d9d9d9" }} />;
  const commonTooltip = (
    <Tooltip
      contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#fff", borderRadius: 6 }}
      itemStyle={{ color: "#fff" }}
    />
  );
  const commonLegend = <Legend wrapperStyle={{ fontSize: 12 }} />;

  const priceTickFormatter = (value: number) => formatCurrency(value, { compact: true, decimals: 1 });
  const priceTooltipFormatter = (value: unknown) => `¥${(Number(value) || 0).toFixed(2)}`;

  if (chartType === "LINE") {
    return (
      <div style={{ width: "100%", height: config.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            {commonGrid}
            {commonXAxis}
            <YAxis
              tick={{ fill: "#999", fontSize: config.tickFontSize }}
              tickLine={{ stroke: "#d9d9d9" }}
              tickFormatter={priceTickFormatter}
            />
            {commonTooltip}
            {commonLegend}
            <Line
              dataKey="涨停"
              stroke="#52c41a"
              strokeWidth={config.lineWidth}
              dot={{ r: isMobile ? 3 : 4 }}
              name="涨停价"
            />
            <Line
              dataKey="跌停"
              stroke="#ff4d4f"
              strokeWidth={config.lineWidth}
              dot={{ r: isMobile ? 3 : 4 }}
              name="跌停价"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: config.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {commonGrid}
          {commonXAxis}
          <YAxis
            tick={{ fill: "#999", fontSize: config.tickFontSize }}
            tickLine={{ stroke: "#d9d9d9" }}
            tickFormatter={priceTickFormatter}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", color: "#fff", borderRadius: 6 }}
            itemStyle={{ color: "#fff" }}
            formatter={priceTooltipFormatter}
          />
          {commonLegend}
          <Bar
            dataKey="涨停"
            fill="#52c41a"
            radius={[2, 2, 0, 0]}
            name="涨停价"
            barSize={config.barSize}
          />
          <Bar
            dataKey="跌停"
            fill="#ff4d4f"
            radius={[2, 2, 0, 0]}
            name="跌停价"
            barSize={config.barSize}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

BasicChart.displayName = "BasicChart";
