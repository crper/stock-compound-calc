/**
 * 计算结果展示组件
 * 展示股票连板收益计算的详细结果
 */
import { Card, Col, Empty, Row } from "antd";
import React from "react";
import type { CalculationResult, CalculationParams } from "@/types";
import { ResultOverviewCard } from "./ResultOverviewCard";
import { ChartContainer } from "../charts/ChartContainer";

/**
 * ResultsDisplay 组件的 Props 接口
 *
 * @interface ResultsDisplayProps
 * @description 定义结果展示组件的属性，包含计算结果和设备类型信息
 */

interface ResultsDisplayProps {
  /**
   * 计算结果对象
   * 包含涨停和跌停两种情况的计算结果
   * 为 null 时显示空状态
   */
  results: {
    /** 涨停计算结果 */
    up: CalculationResult;
    /** 跌停计算结果 */
    down: CalculationResult;
  } | null;

  /**
   * 是否为移动端设备
   * 用于响应式布局和样式调整
   */
  isMobile: boolean;

  /**
   * 计算参数（用于展示计算条件）
   */
  params?: CalculationParams;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = React.memo(
  ({ results, isMobile, params }) => {
    if (!results) {
      return (
        <Card
          size={isMobile ? "default" : "small"}
          style={{
            height: "100%",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease",
          }}
          styles={{
            body: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              padding: isMobile ? "24px" : "32px",
            },
          }}
          className="dark:bg-gray-800 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            styles={{
              image: {
                height: isMobile ? 100 : 80,
                opacity: 0.6,
              },
            }}
            description={
              <div className="text-center">
                <span className="text-gray-500 dark:text-gray-400 text-base block mb-2 transition-all duration-300">
                  输入参数后自动显示计算结果
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  调整表单中的参数开始计算
                </span>
              </div>
            }
          />
        </Card>
      );
    }

    return (
      <Card
        size={isMobile ? "default" : "small"}
        style={{
          height: "100%",
          minHeight: isMobile ? "auto" : "400px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
        }}
        styles={{
          body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "20px" : "24px",
            padding: isMobile ? "20px" : "28px",
            transition: "all 0.3s ease",
          },
        }}
        className="scale-in dark:bg-gray-800 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md"
      >
        {/* 概览卡片区域 */}
        <div style={{ flex: "0 0 auto" }}>
          <Row gutter={[isMobile ? 16 : 20, isMobile ? 16 : 20]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <div className="animate-[slideIn_0.4s_ease-out_0.05s_both]">
                <ResultOverviewCard
                  result={results.up}
                  type="up"
                  isMobile={isMobile}
                  params={params}
                  defaultExpanded={!isMobile} // 桌面端默认展开，移动端默认折叠
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <div className="animate-[slideIn_0.4s_ease-out_0.1s_both]">
                <ResultOverviewCard
                  result={results.down}
                  type="down"
                  isMobile={isMobile}
                  params={params}
                  defaultExpanded={!isMobile} // 桌面端默认展开，移动端默认折叠
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* 图表区域 */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
          className="animate-[slideIn_0.4s_ease-out_0.15s_both]"
        >
          <ChartContainer results={results} isMobile={isMobile} />
        </div>
      </Card>
    );
  },
);

ResultsDisplay.displayName = "ResultsDisplay";
