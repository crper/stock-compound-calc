import React from "react";
import { Card, Typography, Tag, Divider, Space } from "antd";
import {
  GithubOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  BarChartOutlined,
  HistoryOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@/components/navigation/NavMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <NavMenu isMobile={isMobile} />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border-0 mb-6">
          <div className="text-center mb-8">
            <Title level={isMobile ? 3 : 2} className="mb-4 dark:text-white">
              {t("about.title")}
            </Title>
            <Paragraph className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
              {t("about.description")}
            </Paragraph>
          </div>

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
                  <Space direction="vertical" size="small" className="w-full">
                    <div className="flex items-center gap-3">
                      {feature.icon}
                      <Text strong className="dark:text-white">
                        {feature.title}
                      </Text>
                    </div>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</Text>
                  </Space>
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
      </div>
    </div>
  );
});

About.displayName = "About";
