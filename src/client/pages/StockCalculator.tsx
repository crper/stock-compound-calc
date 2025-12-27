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
} from "antd";
import { CalculatorOutlined, HistoryOutlined } from "@ant-design/icons";
import { useStockCalculator } from "@/client/hooks/useStockCalculator";
import { useResponsive } from "@/client/hooks/useResponsive";
import {
  CalculationForm,
  ResultsDisplay,
  HistoryDrawer,
  ErrorBoundary,
  ThemeToggle,
} from "@/client/components";

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
      <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <Layout className="min-h-screen w-full bg-transparent">
          <Layout.Content
            className={`max-w-[1400px] mx-auto w-full ${isMobile ? "px-2 py-3" : "px-4 py-6"}`}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {/* 标题区域 */}
                <div className="mb-5 bg-white/95 backdrop-blur-md dark:bg-gray-800/95 rounded-xl p-5 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/50 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <Space size={isMobile ? "small" : "middle"} wrap>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <CalculatorOutlined className="text-white text-[20px] sm:text-[24px]" />
                        </div>
                        <div>
                          <Title
                            level={isMobile ? 4 : 3}
                            className="!m-0 !text-xl sm:!text-2xl !font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                          >
                            股价收益计算器
                          </Title>
                          <Space size="small" className={isMobile ? "mt-1" : "mt-1.5"}>
                            <Tag color="blue" className="m-0 rounded">
                              智能计算
                            </Tag>
                            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-[13px] max-w-[400px] truncate block">
                              快速计算股票连板收益，助您把握投资机会
                            </span>
                          </Space>
                        </div>
                      </Space>
                    </div>
                    <Space size="small">
                      <ThemeToggle />
                      <Badge count={history.length} showZero={false} size="small" offset={[-5, 5]}>
                        <Button
                          type="primary"
                          icon={<HistoryOutlined className="text-[14px] sm:text-[16px]" />}
                          onClick={openHistoryDrawer}
                          disabled={history.length === 0}
                          size={isMobile ? "middle" : "large"}
                          style={{
                            borderRadius: "8px",
                            background:
                              history.length > 0
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : undefined,
                            border: history.length > 0 ? "none" : undefined,
                            height: isMobile ? "36px" : "40px",
                            paddingLeft: isMobile ? "16px" : "20px",
                            paddingRight: isMobile ? "16px" : "20px",
                          }}
                        >
                          {isMobile ? "历史" : "历史记录"}
                        </Button>
                      </Badge>
                    </Space>
                  </div>
                </div>

                <Card
                  className={`flex flex-col ${isMobile ? "" : "min-h-[calc(100vh-120px)]"}`}
                  styles={{
                    body: {
                      padding: isMobile ? "16px" : "24px",
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
                      className="mb-4"
                    />
                  )}

                  <Row gutter={[24, 24]} className="flex-1 items-start">
                    <Col xs={24} lg={12} xl={10} xxl={9}>
                      <CalculationForm
                        form={form}
                        onValuesChange={handleValuesChange}
                        isFieldValid={isFieldValid}
                        error={error}
                      />
                    </Col>

                    <Col xs={24} lg={12} xl={14} xxl={15}>
                      <ResultsDisplay
                        results={results}
                        isMobile={isMobile}
                        params={currentParams}
                      />
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
          style={{ right: 24, bottom: 24 }}
          tooltip="查看历史记录"
        />
      )}
    </ErrorBoundary>
  );
};
