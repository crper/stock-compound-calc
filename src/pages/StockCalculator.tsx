/**
 * 股价收益计算器主页面组件
 *
 * 功能概述：
 * - 提供股票连板收益计算功能
 * - 支持正向（涨停）和负向（跌停）两种计算模式
 * - 实时计算并展示结果
 * - 历史记录管理和查看
 * - 响应式设计，支持移动端和桌面端
 *
 * 组件架构：
 * - 使用自定义 Hook 管理业务逻辑和状态
 * - 采用模块化组件设计，职责分离
 * - 统一的错误处理和用户反馈机制
 *
 * @author Stock Calculator Team
 * @since 1.0.0
 */
import React from "react";
import {
  Alert,
  Row,
  Col,
  Layout,
  Form,
  Card,
  Typography,
  Button,
  Space,
  FloatButton,
  Tag,
  Badge,
  Avatar,
  Divider,
  Tooltip,
} from "antd";
import {
  HistoryOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useStockCalculator } from "@/hooks/useStockCalculator";
import { useResponsive } from "@/hooks/useResponsive";
import {
  CalculationForm,
  ResultsDisplay,
  HistoryDrawer,
  ErrorBoundary,
  ThemeToggle,
  NavMenu,
} from "@/components";

const { Title } = Typography;

export const StockCalculator: React.FC = () => {
  // 初始化 Ant Design 表单实例，用于管理表单状态和验证
  const [form] = Form.useForm();

  // 获取响应式状态，用于移动端适配
  const { isMobile } = useResponsive();

  // 使用自定义 Hook 管理股票计算器的核心业务逻辑
  // 包含：计算结果、错误处理、历史记录管理等功能
  const {
    results, // 计算结果对象（包含涨停和跌停两种情况）
    error, // 错误信息
    setError, // 设置错误信息的方法
    history, // 历史记录数组
    historyDrawerVisible, // 历史记录抽屉可见性
    setHistoryDrawerVisible, // 设置历史记录抽屉可见性
    loadFromHistory, // 从历史记录加载计算结果
    clearHistory, // 清除所有历史记录
    deleteHistory, // 批量删除历史记录
    openHistoryDrawer, // 打开历史记录抽屉
    isFieldValid, // 验证单个字段是否有效
    handleValuesChange, // 处理表单值变化（带防抖）
    currentParams, // 当前计算参数
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
                {/* 全新设计的顶栏 - 现代简约风格 */}
                <Card
                  className="mb-6 overflow-hidden"
                  styles={{
                    body: {
                      padding: 0,
                    },
                  }}
                >
                  <div className="relative">
                    {/* 顶部渐变装饰条 */}
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
                            {/* Logo 区域 */}
                            <Avatar
                              size={isMobile ? 56 : 64}
                              icon={<LineChartOutlined />}
                              style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className="shadow-lg"
                            />

                            <div>
                              {/* 主标题 */}
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
                                  股价收益计算器
                                </Title>
                                <Tooltip title="支持涨停/跌停双向计算">
                                  <Tag
                                    icon={<ArrowUpOutlined />}
                                    color="success"
                                    style={{
                                      borderRadius: 12,
                                      fontSize: "0.75rem",
                                      display: isMobile ? "none" : "inline-flex",
                                    }}
                                  >
                                    涨停
                                  </Tag>
                                  <Tag
                                    icon={<ArrowDownOutlined />}
                                    color="error"
                                    style={{
                                      borderRadius: 12,
                                      fontSize: "0.75rem",
                                      display: isMobile ? "none" : "inline-flex",
                                    }}
                                  >
                                    跌停
                                  </Tag>
                                </Tooltip>
                              </Space>

                              {/* 副标题 */}
                              <div className="mt-1">
                                <Typography.Text
                                  type="secondary"
                                  style={{
                                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                                  }}
                                >
                                  智能分析连板收益，实时计算投资回报
                                </Typography.Text>
                              </div>

                              {/* 特性标签 */}
                              <Space
                                size="small"
                                style={{ marginTop: 8 }}
                                className={isMobile ? "hidden" : "flex"}
                              >
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
                                  历史记录
                                </Tag>
                                <Tag
                                  color="cyan"
                                  style={{
                                    borderRadius: 12,
                                    fontSize: "0.7rem",
                                    background: "rgba(6, 182, 212, 0.1)",
                                    border: "1px solid rgba(6, 182, 212, 0.2)",
                                  }}
                                >
                                  数据可视化
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
                            <Badge
                              count={history.length}
                              showZero={false}
                              size="small"
                              offset={[-5, 5]}
                            >
                              <Button
                                type={history.length > 0 ? "primary" : "default"}
                                icon={<HistoryOutlined />}
                                onClick={openHistoryDrawer}
                                disabled={history.length === 0}
                                size={isMobile ? "middle" : "large"}
                                style={{
                                  borderRadius: 10,
                                  boxShadow:
                                    history.length > 0
                                      ? "0 2px 8px rgba(102, 126, 234, 0.3)"
                                      : undefined,
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
                      title="输入错误"
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
          tooltip="查看历史记录"
        />
      )}
    </ErrorBoundary>
  );
};
