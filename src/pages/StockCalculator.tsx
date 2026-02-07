/**
 * 股价收益计算器主页面组件
 * 使用 PageContainer 统一布局管理
 */
import React from "react";
import { Alert, Row, Col, Form } from "antd";
import { useTranslation } from "react-i18next";
import { useStockCalculator } from "@/hooks/useStockCalculator";
import { useResponsive } from "@/hooks/useResponsive";
import {
  CalculationForm,
  ResultsDisplay,
  HistoryDrawer,
  ErrorBoundary,
  PageContainer,
  HistoryFloatButton,
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
      <PageContainer>
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
              <ResultsDisplay results={results} isMobile={isMobile} params={currentParams} />
            </div>
          </Col>
        </Row>
      </PageContainer>

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
      <HistoryFloatButton count={history.length} onClick={openHistoryDrawer} visible={isMobile} />
    </ErrorBoundary>
  );
};

StockCalculator.displayName = "StockCalculator";
