/**
 * 亏损回本计算器主页面组件
 */
import React from "react";
import { Card, Row, Col, Drawer, Empty, Tag, Popconfirm, Button, App, Typography } from "antd";
import { HistoryOutlined, DeleteOutlined, ClearOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLossRecovery } from "@/hooks/useLossRecovery";
import { useResponsive } from "@/hooks/useResponsive";
import {
  RecoveryForm,
  RecoveryResult,
  RecoveryTable,
  ErrorBoundary,
  HistoryFloatButton,
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
      <Row gutter={[32, 32]} className="flex-1 items-start">
        {/* 手机单列 / 平板：表单与结果并排、速查表整行 / 桌面三列 */}
        <Col xs={24} md={12} lg={8}>
          <div className="h-full animate-[slideIn_0.4s_ease-out]">
            <RecoveryForm value={lossPercent} onChange={handleLossChange} />
          </div>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <div className="h-full animate-[slideIn_0.4s_ease-out_0.1s_both]">
            <RecoveryResult lossPercent={lossPercent} isMobile={isMobile} />
          </div>
        </Col>

        <Col xs={24} md={24} lg={8}>
          <div className="h-full animate-[slideIn_0.4s_ease-out_0.2s_both]">
            <RecoveryTable currentValue={lossPercent} />
          </div>
        </Col>
      </Row>

      {/* 历史记录抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center">
              <HistoryOutlined className="text-white text-lg" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {t("recoveryCalculator.history.title", { defaultValue: "回本历史" })}
              </span>
              {history.length > 0 && (
                <Tag className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                  {t("common.historyCount", { count: history.length })}
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
                        <Tag className="m-0 bg-red-50 text-red-600 border-red-200">
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
                      aria-label={t("common.buttons.delete")}
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
      <HistoryFloatButton count={history.length} onClick={openHistoryDrawer} visible={isMobile} />
    </ErrorBoundary>
  );
};

LossRecoveryCalculator.displayName = "LossRecoveryCalculator";
