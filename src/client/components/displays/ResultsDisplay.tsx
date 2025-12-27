/**
 * 计算结果展示组件
 * 展示股票连板收益计算的详细结果
 */
import { Card, Col, Empty, Row } from "antd";
import React from "react";
import type { CalculationResult, CalculationParams } from "@/shared/types";
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
            borderRadius: isMobile ? "8px" : "6px",
            transition: "all 0.3s ease",
          }}
          styles={{
            body: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            },
          }}
          className="dark:bg-gray-800 dark:border-gray-700"
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            styles={{
              image: {
                height: isMobile ? 80 : 60,
              },
            }}
            description={
              <span className="text-gray-400 dark:text-gray-500 text-sm transition-all duration-300">
                输入参数后自动显示计算结果
              </span>
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
          borderRadius: isMobile ? "8px" : "6px",
          transition: "all 0.3s ease",
        }}
        styles={{
          body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "16px" : "20px",
            padding: isMobile ? "16px" : "20px",
            transition: "all 0.3s ease",
          },
        }}
        className="scale-in dark:bg-gray-800 dark:border-gray-700"
      >
        {/* 概览卡片区域 */}
        <div style={{ flex: "0 0 auto" }}>
          <Row gutter={[isMobile ? 12 : 16, isMobile ? 12 : 16]}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <ResultOverviewCard
                result={results.up}
                type="up"
                isMobile={isMobile}
                params={params}
              />
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <ResultOverviewCard
                result={results.down}
                type="down"
                isMobile={isMobile}
                params={params}
              />
            </Col>
          </Row>
        </div>

        {/* 图表区域 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ChartContainer results={results} isMobile={isMobile} />
        </div>
      </Card>
    );
  },
);

ResultsDisplay.displayName = "ResultsDisplay";
