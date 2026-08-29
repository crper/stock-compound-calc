/**
 * 关于页面组件
 * 使用 PageContainer 统一布局管理
 */
import React from "react";
import { Tag, Divider, Flex, Typography, Card } from "antd";
import {
  GithubOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  BarChartOutlined,
  HistoryOutlined,
  WarningOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ErrorBoundary, PageContainer } from "@/components";
import alipayImg from "@/assets/sponsor/sponsor_alipay.jpg";
import wechatImg from "@/assets/sponsor/sponsor_wechat.jpg";

const { Title, Paragraph, Text } = Typography;

export const About: React.FC = React.memo(() => {
  const { t } = useTranslation();

  const techStack = [
    {
      category: t("about.techStack.backend"),
      items: [t("about.techStack.list.vitePlus"), t("about.techStack.list.node")],
    },
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
    <ErrorBoundary>
      <PageContainer>
        {/* Tech Stack */}
        <div className="mb-8">
          <Title level={2} className="!text-xl mb-4 dark:text-white flex items-center gap-2">
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
          <Title level={2} className="!text-xl mb-4 dark:text-white flex items-center gap-2">
            <Tag color="green">{t("about.features.title")}</Tag>
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 dark:bg-gray-700/50 border-0 hover:shadow-md transition-shadow p-4 rounded-lg"
              >
                <Flex vertical gap="small" className="w-full">
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <Text strong className="dark:text-white">
                      {feature.title}
                    </Text>
                  </div>
                  <Text className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</Text>
                </Flex>
              </div>
            ))}
          </div>
        </div>

        <Divider className="dark:border-gray-600" />

        {/* Developer */}
        <div className="mb-8">
          <Title level={2} className="!text-xl mb-4 dark:text-white flex items-center gap-2">
            <Tag color="purple">{t("about.developer.title")}</Tag>
          </Title>
          <Paragraph className="dark:text-gray-300">{t("about.developer.description")}</Paragraph>
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

        {/* Sponsor */}
        <div className="mb-8">
          <Title level={2} className="!text-xl mb-4 dark:text-white flex items-center gap-2">
            <Tag color="red">
              <HeartOutlined className="mr-1" />
              {t("about.sponsor.title")}
            </Tag>
          </Title>
          <Paragraph className="dark:text-gray-300 mb-4">
            {t("about.sponsor.description")}
          </Paragraph>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PayPal */}
            <a
              href="https://paypal.me/xcrper"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("about.sponsor.paypal")}
              className="group block"
            >
              <Card
                className="h-full text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                styles={{ body: { padding: 20, height: "100%" } }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.956 0h6.515c3.337 0 4.928 1.617 5.284 3.385.079.393.127.802.127 1.224 0 3.918-2.65 5.607-6.256 5.607h-2.07c-.56 0-.912-.325-1.007-.788L7.076 21.337zm7.615-14.26c-.356-1.77-1.95-3.388-5.285-3.388H2.47a.641.641 0 0 0-.632.74L4.945 21.337h4.606l2.748-13.022c.095.463.447.788 1.007.788h2.07c3.606 0 6.256-1.689 6.256-5.607 0-.422-.048-.831-.127-1.224h-.001z" />
                  </svg>
                </div>
                <Text strong className="text-blue-600 dark:text-blue-400 block mb-1">
                  {t("about.sponsor.paypal")}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {t("about.sponsor.paypalUrl")}
                </Text>
              </Card>
            </a>

            {/* WeChat */}
            <Card
              className="text-center overflow-hidden"
              styles={{ body: { padding: 12 } }}
              cover={
                <div className="aspect-square bg-white dark:bg-gray-900 flex items-center justify-center p-4">
                  <img
                    src={wechatImg}
                    alt={t("about.sponsor.wechat")}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              }
            >
              <Text className="text-xs">{t("about.sponsor.wechat")}</Text>
            </Card>

            {/* Alipay */}
            <Card
              className="text-center overflow-hidden"
              styles={{ body: { padding: 12 } }}
              cover={
                <div className="aspect-square bg-white dark:bg-gray-900 flex items-center justify-center p-4">
                  <img
                    src={alipayImg}
                    alt={t("about.sponsor.alipay")}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              }
            >
              <Text className="text-xs">{t("about.sponsor.alipay")}</Text>
            </Card>
          </div>
        </div>

        <Divider className="dark:border-gray-600" />

        {/* Disclaimer */}
        <div>
          <Title level={2} className="!text-xl mb-4 dark:text-white flex items-center gap-2">
            <Tag color="orange">
              <WarningOutlined className="mr-1" />
              {t("about.disclaimer.title")}
            </Tag>
          </Title>
          <Paragraph className="text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            {t("about.disclaimer.content")}
          </Paragraph>
        </div>
      </PageContainer>
    </ErrorBoundary>
  );
});

About.displayName = "About";
