/**
 * 头部内容组件 - 统一的头部布局和样式
 * 包含 Logo、标题、主题切换、语言选择
 */
import { Badge, Flex, Space } from "antd";
import {
  LineChartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

export interface HeaderContentProps {
  page?: string;
}

export const HeaderContent: React.FC<HeaderContentProps> = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isMobile } = useResponsive();

  const getPageTitle = () => {
    switch (pathname) {
      case "/recovery":
        return t("common.navigation.lossRecovery");
      case "/about":
        return t("common.navigation.about");
      default:
        return t("common.navigation.stockCalculator");
    }
  };

  const getPageSubtitle = () => {
    switch (pathname) {
      case "/recovery":
        return t("common.navigation.lossRecoverySubtitle");
      case "/about":
        return t("common.navigation.aboutSubtitle");
      default:
        return t("common.navigation.stockCalculatorSubtitle");
    }
  };

  const getPageTags = () => {
    if (isMobile) return [];
    
    switch (pathname) {
      case "/recovery":
        return [
          { label: t("common.tags.lossRecovery"), color: "green" },
          { label: t("common.tags.realTime"), color: "blue" },
        ];
      case "/about":
        return [
          { label: t("common.tags.info"), color: "purple" },
          { label: t("common.tags.help"), color: "cyan" },
        ];
      default:
        return [
          { label: t("common.tags.limitUp"), color: "green" },
          { label: t("common.tags.limitDown"), color: "red" },
          { label: t("common.tags.realTime"), color: "blue" },
          { label: t("common.tags.history"), color: "purple" },
          { label: t("common.tags.visualization"), color: "cyan" },
        ];
    }
  };

  return (
    <div className="min-h-[64px]">
      <Flex gap={LAYOUT_CONSTANTS.spacing.lg} align="center">
        {/* Logo 区域 */}
        <Flex gap={LAYOUT_CONSTANTS.spacing.md} align="center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <LineChartOutlined className="text-white text-xl" />
          </div>

          <div className="flex flex-col">
            <Flex gap={LAYOUT_CONSTANTS.spacing.sm} wrap>
              <h1
                className="text-lg font-bold"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {getPageTitle()}
              </h1>

              {getPageTags().map((tag, index) => (
                <Badge
                  key={index}
                  color={tag.color}
                  text={tag.label}
                  size="small"
                  style={{ fontSize: "12px", padding: "2px 6px" }}
                />
              ))}
            </Flex>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {getPageSubtitle()}
            </p>
          </div>
        </Flex>

        {/* 右侧操作按钮 - 仅桌面端显示 */}
        <div className="hidden md:flex">
          <Space size="small">
            <ThemeToggle />
            <LanguageSelector />
          </Space>
        </div>
      </Flex>
    </div>
  );
};

HeaderContent.displayName = "HeaderContent";