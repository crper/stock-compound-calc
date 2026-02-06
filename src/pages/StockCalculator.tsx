/**
 * 股价收益计算器主页面组件
 */
import React from "react";
import {
  Alert,
  Row,
  Col,
  Layout,
  Form,
  Card,
  FloatButton,
} from "antd";
import {
  HistoryOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useStockCalculator } from "@/hooks/useStockCalculator";
import { useResponsive } from "@/hooks/useResponsive";
import {
  CalculationForm,
  ResultsDisplay,
  HistoryDrawer,
  ErrorBoundary,
  ThemeToggle,
  NavMenu,
  LanguageSelector,
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
      <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] via-[#7c6cd9] to-[#764ba2] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        <Layout className="min-h-screen w-full bg-transparent relative z-10">
          <Layout.Content
            className={`max-w-[1400px] mx-auto w-full ${isMobile ? "px-3 py-4" : "px-6 py-8"}`}
          >
            <Row gutter={[24, 24]}>
              <Col span={24}>
                {/* 头部卡片 */}
                <Card className="mb-6 overflow-hidden" styles={{ body: { padding: 0 } }}>
                  <div className="relative">
                    {/* 顶部渐变装饰条 */}
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                      }}
                    />

                    <div className="p-5 sm:p-6">
                      {/* 头部内容 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* 左侧：Logo + 标题 */}
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            <LineChartOutlined className="text-white text-2xl sm:text-3xl" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h1
                                className="text-xl sm:text-2xl font-bold"
                                style={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                {t("stockCalculator.title")}
                              </h1>
                              {!isMobile && (
                                <>
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                                    <ArrowUpOutlined /> {t("common.tags.limitUp")}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                                    <ArrowDownOutlined /> {t("common.tags.limitDown")}
                                  </span>
                                </>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {t("stockCalculator.subtitle")}
                            </p>
                            {!isMobile && (
                              <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-100">
                                  {t("common.tags.realTime")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-600 border border-purple-100">
                                  {t("common.tags.history")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-cyan-50 text-cyan-600 border border-cyan-100">
                                  {t("common.tags.visualization")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 右侧：操作按钮 */}
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                          <LanguageSelector />
                          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                          <button
                            onClick={openHistoryDrawer}
                            disabled={history.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              history.length > 0
                                ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-md hover:shadow-lg"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <HistoryOutlined />
                            {t("common.buttons.history")}
                            {history.length > 0 && (
                              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                                {history.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <NavMenu isMobile={isMobile} />

                <Card
                  className={`mt-6 flex flex-col rounded-2xl border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md ${isMobile ? "" : "min-h-[calc(100vh-140px)]"}`}
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
              </Col>
            </Row>
          </Layout.Content>
        </Layout>

        <HistoryDrawer
          visible={historyDrawerVisible}
          onClose={() => setHistoryDrawerVisible(false)}
          history={history}
          isMobile={isMobile}
          onLoadHistory={loadFromHistory}
          onClearHistory={clearHistory}
          onDeleteHistory={deleteHistory}
        />
      </div>

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
