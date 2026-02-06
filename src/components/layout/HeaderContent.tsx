/**
 * 头部内容组件 - 统一的头部布局和样式
 * 包含 Logo、标题、页面相关标签
 */
import { Badge, Flex } from "antd";
import {
  LineChartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";

export const HeaderContent: React.FC = () => {
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

  const getPageTags = () => {
    if (isMobile) return [];
    
    switch (pathname) {
      case "/recovery":
        return [
          { label: t("common.tags.lossRecovery"), color: "lime" },
        ];
      case "/about":
        return [
          { label: t("common.tags.info"), color: "purple" },
        ];
      default:
        return [
          { label: t("common.tags.limitUp"), color: "green" },
        ];
    }
  };

  return (
    <Flex gap={8} align="center" className="h-full">
      {/* Logo */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <LineChartOutlined className="text-white text-base" />
      </div>

      {/* 标题 + 标签 */}
      <Flex gap={4} align="center" wrap className="min-w-0">
        <h1
          className="text-base font-bold truncate"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            flexShrink: 0,
          }}
        >
          {getPageTitle()}
        </h1>

        {getPageTags().map((tag, index) => (
          <Badge
            key={index}
            color={tag.color}
            text={tag.label}
            style={{ fontSize: "11px", padding: "2px 4px" }}
          />
        ))}
      </Flex>
    </Flex>
  );
};

HeaderContent.displayName = "HeaderContent";
