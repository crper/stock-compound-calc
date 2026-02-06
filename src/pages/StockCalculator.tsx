/**
 * 股价收益计算器主页面组件
 * 使用 MainLayout 统一布局管理
 */
import React from "react";
import { Alert, Row, Col, Card, FloatButton, Form } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useStockCalculator } from "@/hooks/useStockCalculator";
import { useResponsive } from "@/hooks/useResponsive";
import {
  CalculationForm,
  ResultsDisplay,
  HistoryDrawer,
  ErrorBoundary,
  NavMenu,
} from "@/components";

export const StockCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const { isMobile } = useResponsive();
  const { t } = useTranslation();

  const {
    results,
    error,
    setError,
    history,
    historyDrawerVisible,
    setHistoryDrawerVisible,
    loadFromHistory,
    clearHistory,
    deleteHistory,
    openHistoryDrawer,
    isFieldValid,
    handleValuesChange,
    currentParams,
  } = useStockCalculator();

  return (
    <ErrorBoundary>
      <div className="w-full relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        {/* 导航菜单 */}
        <div className="relative z-10 mb-6">
          <NavMenu isMobile={isMobile} />
        </div>

        {/* 主要内容 */}
        <div className="relative z-10">
          <Card
            className={`flex flex-col rounded-2xl border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md ${isMobile ? "" : "min-h-[calc(100vh-140px)]"}`}
            styles={{
              body: {
                padding: isMobile ? "20px" : "28px",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              },
            }}
          >
            {error && (
              <Alert
                title={t("stockCalculator.errors.inputError")}
                description={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                className="mb-6 rounded-xl shadow-sm"
                style={{
                  animation: "shake 0.5s ease-in-out",
                }}
              />
            )}

            <Row gutter={[32, 32]} className="flex-1 items-start">
              <Col xs={24} lg={12} xl={10} xxl={9}>
                <div className="h-full animate-[slideIn_0.4s_ease-out]">
                  <CalculationForm
                    form={form}
                    onValuesChange={handleValuesChange}
                    isFieldValid={isFieldValid}
                    error={error}
                  />
                </div>
              </Col>

              <Col xs={24} lg={12} xl={14} xxl={15}>
                <div className="h-full animate-[slideIn_0.4s_ease-out_0.1s_both]">
                  <ResultsDisplay
                    results={results}
                    isMobile={isMobile}
                    params={currentParams}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <HistoryDrawer
        visible={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
        history={history}
        isMobile={isMobile}
        onLoadHistory={loadFromHistory}
        onClearHistory={clearHistory}
        onDeleteHistory={deleteHistory}
      />

      {/* 浮动按钮 - 移动端显示 */}
      {isMobile && history.length > 0 && (
        <FloatButton
          icon={<HistoryOutlined />}
          onClick={openHistoryDrawer}
          badge={{ count: history.length }}
          style={{
            right: 24,
            bottom: 24,
            boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
          }}
          tooltip={t("common.tooltips.historyButton")}
        />
      )}
    </ErrorBoundary>
  );
};

StockCalculator.displayName = "StockCalculator";