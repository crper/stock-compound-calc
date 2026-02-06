import React from "react";
import { Card, Typography, Tag, Divider, Flex, Layout, Row, Col } from "antd";
import {
  GithubOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  BarChartOutlined,
  HistoryOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { NavMenu, ThemeToggle, LanguageSelector } from "@/components";
import { useResponsive } from "@/hooks/useResponsive";

const { Title, Paragraph, Text } = Typography;

export const About: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const techStack = [
    { category: t("about.techStack.backend"), items: [t("about.techStack.list.bun")] },
    {
      category: t("about.techStack.frontend"),
      items: [
        t("about.techStack.list.react"),
        t("about.techStack.list.typescript"),
        t("about.techStack.list.antd"),
        t("about.techStack.list.tailwind"),
        t("about.techStack.list.reactRouter"),
      ],
    },
    {
      category: t("about.techStack.database"),
      items: [t("about.techStack.list.indexeddb"), t("about.techStack.list.dexie")],
    },
    {
      category: t("about.techStack.tools"),
      items: [
        t("about.techStack.list.recharts"),
        t("about.techStack.list.decimal"),
        t("about.techStack.list.zod"),
        t("about.techStack.list.i18next"),
      ],
    },
  ];

  const features = [
    {
      icon: <CalculatorOutlined className="text-2xl text-indigo-500" />,
      title: t("about.features.stock.title"),
      desc: t("about.features.stock.desc"),
    },
    {
      icon: <LineChartOutlined className="text-2xl text-emerald-500" />,
      title: t("about.features.recovery.title"),
      desc: t("about.features.recovery.desc"),
    },
    {
      icon: <BarChartOutlined className="text-2xl text-blue-500" />,
      title: t("about.features.visualization.title"),
      desc: t("about.features.visualization.desc"),
    },
    {
      icon: <HistoryOutlined className="text-2xl text-amber-500" />,
      title: t("about.features.history.title"),
      desc: t("about.features.history.desc"),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#667eea] via-[#7c6cd9] to-[#764ba2] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
      </div>

      <Layout className="min-h-screen w-full bg-transparent relative z-10">
        <Layout.Content
          className={`max-w-4xl mx-auto w-full ${isMobile ? "px-3 py-4" : "px-6 py-8"}`}
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
                          <InfoCircleOutlined className="text-white text-2xl sm:text-3xl" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h1
                              className="text-xl sm:text-2xl font-bold"
                              style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {t("about.title")}
                            </h1>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {t("about.description")}
                          </p>
                        </div>
                      </div>

                      {/* 右侧：操作按钮 */}
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSelector />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <NavMenu isMobile={isMobile} />

              {/* 主内容卡片 */}
              <Card
                className="mt-6 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl border-0"
                styles={{
                  body: {
                    padding: isMobile ? "20px" : "28px",
                  },
                }}
              >
                {/* Tech Stack */}
                <div className="mb-8">
                  <Title level={4} className="mb-4 dark:text-white flex items-center gap-2">
                    <Tag color="blue">{t("about.techStack.title")}</Tag>
                  </Title>
                  <div className="space-y-4">
                    {techStack.map((section) => (
                      <div key={section.category}>
                        <Text strong className="dark:text-gray-300 block mb-2">
                          {section.category}
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {section.items.map((item) => (
                            <Tag
                              key={item}
                              className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            >
                              {item}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider className="dark:border-gray-600" />

                {/* Features */}
                <div className="mb-8">
                  <Title level={4} className="mb-4 dark:text-white flex items-center gap-2">
                    <Tag color="green">{t("about.features.title")}</Tag>
                  </Title>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature) => (
                      <Card
                        key={feature.title}
                        size="small"
                        className="bg-gray-50 dark:bg-gray-700/50 border-0 hover:shadow-md transition-shadow"
                      >
                        <Flex vertical gap="small" className="w-full">
                          <div className="flex items-center gap-3">
                            {feature.icon}
                            <Text strong className="dark:text-white">
                              {feature.title}
                            </Text>
                          </div>
                          <Text className="text-gray-600 dark:text-gray-300 text-sm">
                            {feature.desc}
                          </Text>
                        </Flex>
                      </Card>
                    ))}
                  </div>
                </div>

                <Divider className="dark:border-gray-600" />

                {/* Developer */}
                <div className="mb-8">
                  <Title level={4} className="mb-4 dark:text-white flex items-center gap-2">
                    <Tag color="purple">{t("about.developer.title")}</Tag>
                  </Title>
                  <Paragraph className="dark:text-gray-300">
                    {t("about.developer.description")}
                  </Paragraph>
                  <a
                    href="https://github.com/crper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                  >
                    <GithubOutlined />
                    {t("about.developer.github")}: github.com/crper
                  </a>
                </div>

                <Divider className="dark:border-gray-600" />

                {/* Disclaimer */}
                <div>
                  <Title level={4} className="mb-4 dark:text-white flex items-center gap-2">
                    <Tag color="orange">
                      <WarningOutlined className="mr-1" />
                      {t("about.disclaimer.title")}
                    </Tag>
                  </Title>
                  <Paragraph className="text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    {t("about.disclaimer.content")}
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </div>
  );
});

About.displayName = "About";
