import React from "react";
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Button,
  Drawer,
  Empty,
  Tag,
  FloatButton,
  Popconfirm,
  App,
} from "antd";
import { HistoryOutlined, CalculatorOutlined, ArrowUpOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLossRecovery } from "@/hooks/useLossRecovery";
import { useResponsive } from "@/hooks/useResponsive";
import {
  RecoveryForm,
  RecoveryResult,
  RecoveryTable,
  NavMenu,
  ThemeToggle,
  ErrorBoundary,
  LanguageSelector,
} from "@/components";

const { Text } = Typography;

export const LossRecoveryCalculator: React.FC = () => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const {
    lossPercent,
    history,
    historyDrawerVisible,
    setHistoryDrawerVisible,
    handleLossChange,
    clearHistory,
    deleteHistory,
    loadFromHistory,
    openHistoryDrawer,
  } = useLossRecovery();

  const handleClear = () => {
    clearHistory();
    message.success(t("common.messages.deleteSuccess", { count: history.length }));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] via-[#7c6cd9] to-[#764ba2] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
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
                            <CalculatorOutlined className="text-white text-2xl sm:text-3xl" />
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
                                {t("recoveryCalculator.title")}
                              </h1>
                              {!isMobile && (
                                <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                                  <ArrowUpOutlined /> {t("common.tags.recoveryAnalysis")}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {t("recoveryCalculator.subtitle")}
                            </p>
                            {!isMobile && (
                              <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-100">
                                  {t("common.tags.realTime")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-600 border border-purple-100">
                                  {t("common.tags.quickLookup")}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-600 border border-orange-100">
                                  {t("common.tags.riskAssessment")}
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
                  className={`mt-6 flex flex-col rounded-2xl border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md ${isMobile ? "" : "min-h-[calc(100vh-280px)]"}`}
                  styles={{
                    body: {
                      padding: isMobile ? "20px" : "28px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    },
                  }}
                >
                  <Row gutter={[32, 32]} className="flex-1 items-start">
                    <Col xs={24} lg={8}>
                      <div className="h-full animate-[slideIn_0.4s_ease-out]">
                        <RecoveryForm value={lossPercent} onChange={handleLossChange} />
                      </div>
                    </Col>

                    <Col xs={24} lg={8}>
                      <div className="h-full animate-[slideIn_0.4s_ease-out_0.1s_both]">
                        <RecoveryResult lossPercent={lossPercent} />
                      </div>
                    </Col>

                    <Col xs={24} lg={8}>
                      <div className="h-full animate-[slideIn_0.4s_ease-out_0.2s_both]">
                        <RecoveryTable currentValue={lossPercent} />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>

        {/* 历史记录抽屉 */}
        <Drawer
          title={
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                <HistoryOutlined className="text-white text-lg" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {t("recoveryCalculator.history.title", { defaultValue: "回本历史" })}
                </span>
                {history.length > 0 && (
                  <Tag className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                    {history.length} {t("stockCalculator.history.recordCount", { count: history.length }).split(" ")[1]}
                  </Tag>
                )}
              </div>
            </div>
          }
          placement={isMobile ? "bottom" : "right"}
          onClose={() => setHistoryDrawerVisible(false)}
          open={historyDrawerVisible}
          size={isMobile ? "100%" : 400}
          className="backdrop-blur-sm"
          styles={{
            body: { padding: "20px" },
            header: { borderBottom: "1px solid #f0f0f0", padding: "16px 20px" },
          }}
          extra={
            history.length > 0 && (
              <Popconfirm
                title={t("stockCalculator.history.confirmClear")}
                description={t("stockCalculator.history.confirmClearDesc")}
                onConfirm={handleClear}
                okText={t("common.buttons.confirm")}
                cancelText={t("common.buttons.cancel")}
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<ClearOutlined />} className="rounded-lg">
                  {t("common.buttons.clearHistory")}
                </Button>
              </Popconfirm>
            )
          }
        >
          <div className="flex flex-col h-full">
            {history.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    {t("common.empty.noHistory")}
                  </span>
                }
                className="mt-12"
              >
                <HistoryOutlined
                  style={{ fontSize: 48 }}
                  className="text-gray-300 dark:text-gray-600 mt-4"
                />
              </Empty>
            ) : (
              <div className="space-y-3">
                {history.map((item, index) => (
                  <Card
                    key={item.id}
                    size="small"
                    className="cursor-pointer hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:border-gray-700"
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Text strong className="dark:text-gray-200 text-lg">
                            {item.lossPercent}%
                          </Text>
                          <Tag size="small" className="m-0 bg-red-50 text-red-600 border-red-200">
                            {t("recoveryCalculator.results.currentLoss")}
                          </Tag>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <div>
                            <Text type="secondary" className="text-xs block">
                              {t("recoveryCalculator.results.requiredGain")}
                            </Text>
                            <Text className="text-base font-semibold text-green-600 dark:text-green-400">
                              +{item.requiredGain}%
                            </Text>
                          </div>
                          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
                          <div>
                            <Text type="secondary" className="text-xs block">
                              {t("recoveryCalculator.results.multiplier")}
                            </Text>
                            <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">
                              {item.multiplier}x
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" className="text-xs mt-2 block">
                          {item.createdAt}
                        </Text>
                      </div>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistory([item.id]);
                          message.success(t("common.messages.deleteSuccess", { count: 1 }));
                        }}
                        className="mt-1"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Drawer>

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
      </div>
    </ErrorBoundary>
  );
};

LossRecoveryCalculator.displayName = "LossRecoveryCalculator";
