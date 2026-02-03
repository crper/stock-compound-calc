import React from "react";
import { Layout, Card, Typography, Row, Col, Button, Badge, Divider, Space, Flex, Avatar, Tag, Tooltip, FloatButton } from "antd";
import { HistoryOutlined, CalculatorOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useLossRecovery } from "@/client/hooks/useLossRecovery";
import { useResponsive } from "@/client/hooks/useResponsive";
import { RecoveryForm, RecoveryResult, RecoveryTable, NavMenu, ThemeToggle, ErrorBoundary } from "@/client/components";

const { Title, Text } = Typography;

export const LossRecoveryCalculator: React.FC = () => {
  const { isMobile } = useResponsive();
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] via-[#7c6cd9] to-[#764ba2] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>

        <Layout className="min-h-screen w-full bg-transparent relative z-10">
          <Layout.Content className={`max-w-[1400px] mx-auto w-full ${isMobile ? "px-3 py-4" : "px-6 py-8"}`}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className="mb-6 overflow-hidden" styles={{ body: { padding: 0 } }}>
                  <div className="relative">
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                      }}
                    />

                    <div className="p-5 sm:p-6">
                      <Row gutter={[16, 16]} align="middle" justify="space-between">
                        <Col xs={24} sm={20} md={18} lg={16}>
                          <Space size={isMobile ? "middle" : "large"} align="center">
                            <Avatar
                              size={isMobile ? 56 : 64}
                              icon={<CalculatorOutlined />}
                              style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className="shadow-lg"
                            />

                            <div>
                              <Space size="small" align="baseline">
                                <Title
                                  level={isMobile ? 4 : 3}
                                  style={{
                                    margin: 0,
                                    fontSize: isMobile ? "1.25rem" : "1.75rem",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                  }}
                                >
                                  亏损回本计算器
                                </Title>
                                <Tooltip title="计算亏损后回本所需的涨幅">
                                  <Tag
                                    icon={<ArrowUpOutlined />}
                                    color="warning"
                                    style={{
                                      borderRadius: 12,
                                      fontSize: "0.75rem",
                                      display: isMobile ? "none" : "inline-flex",
                                    }}
                                  >
                                    回本分析
                                  </Tag>
                                </Tooltip>
                              </Space>

                              <div className="mt-1">
                                <Typography.Text
                                  type="secondary"
                                  style={{
                                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                                  }}
                                >
                                  智能计算回本所需涨幅，提供完整速查表
                                </Typography.Text>
                              </div>

                              <Space size="small" style={{ marginTop: 8 }} className={isMobile ? "hidden" : "flex"}>
                                <Tag
                                  color="blue"
                                  style={{
                                    borderRadius: 12,
                                    fontSize: "0.7rem",
                                    background: "rgba(102, 126, 234, 0.1)",
                                    border: "1px solid rgba(102, 126, 234, 0.2)",
                                  }}
                                >
                                  实时计算
                                </Tag>
                                <Tag
                                  color="purple"
                                  style={{
                                    borderRadius: 12,
                                    fontSize: "0.7rem",
                                    background: "rgba(118, 75, 162, 0.1)",
                                    border: "1px solid rgba(118, 75, 162, 0.2)",
                                  }}
                                >
                                  1-100%速查
                                </Tag>
                                <Tag
                                  color="orange"
                                  style={{
                                    borderRadius: 12,
                                    fontSize: "0.7rem",
                                    background: "rgba(250, 173, 20, 0.1)",
                                    border: "1px solid rgba(250, 173, 20, 0.2)",
                                  }}
                                >
                                  风险评估
                                </Tag>
                              </Space>
                            </div>
                          </Space>
                        </Col>

                        <Col
                          xs={24}
                          sm={4}
                          md={6}
                          lg={8}
                          style={{
                            textAlign: isMobile ? "left" : "right",
                          }}
                        >
                          <Space size="small">
                            <ThemeToggle />
                            <Divider orientation="vertical" style={{ height: 24 }} />
                            <Badge count={history.length} showZero={false} size="small" offset={[-5, 5]}>
                              <Button
                                type={history.length > 0 ? "primary" : "default"}
                                icon={<HistoryOutlined />}
                                onClick={openHistoryDrawer}
                                disabled={history.length === 0}
                                size={isMobile ? "middle" : "large"}
                                style={{
                                  borderRadius: 10,
                                  boxShadow: history.length > 0 ? "0 2px 8px rgba(102, 126, 234, 0.3)" : undefined,
                                }}
                              >
                                历史记录
                              </Button>
                            </Badge>
                          </Space>
                        </Col>
                      </Row>
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
        {historyDrawerVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setHistoryDrawerVisible(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 transition-transform duration-300 ${
            historyDrawerVisible ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            width: isMobile ? "100%" : "400px",
            maxWidth: "100%",
          }}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Title level={4} className="!m-0 dark:text-gray-100">
              历史记录
            </Title>
            <Space>
              <Button danger size="small" onClick={clearHistory} disabled={history.length === 0}>
                清空
              </Button>
              <Button size="small" onClick={() => setHistoryDrawerVisible(false)}>
                关闭
              </Button>
            </Space>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100% - 60px)" }}>
            {history.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Flex vertical align="center" gap="middle">
                  <HistoryOutlined style={{ fontSize: 48 }} />
                  <Text>暂无历史记录</Text>
                </Flex>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {history.map((item) => (
                  <Card
                    key={item.id}
                    size="small"
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="flex items-center justify-between">
                      <Flex vertical gap="small">
                        <Text strong className="dark:text-gray-200">
                          亏损 {item.lossPercent}%
                        </Text>
                        <Text type="secondary" className="text-xs">
                          需涨 {item.requiredGain}% · {item.multiplier}x
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {item.createdAt}
                         </Text>
                      </Flex>
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistory([item.id]);
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
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
            tooltip="查看历史记录"
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

LossRecoveryCalculator.displayName = "LossRecoveryCalculator";
