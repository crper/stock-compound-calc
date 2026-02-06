/**
 * 导航菜单组件 - 使用 Ant Design Menu 系统
 * 提供响应式导航功能
 */
import { Menu, Space, Flex, Divider, Button } from "antd";
import {
  LineChartOutlined,
  CalculatorOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";
import { useTheme } from "@/theme";

interface NavigationMenuProps {
  onClose?: () => void;
  isDrawer?: boolean;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ onClose, isDrawer = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const menuItems = [
    {
      key: "/",
      icon: <LineChartOutlined />,
      label: t("common.navigation.stockCalculator"),
    },
    {
      key: "/recovery",
      icon: <CalculatorOutlined />,
      label: t("common.navigation.lossRecovery"),
    },
    {
      key: "/about",
      icon: <InfoCircleOutlined />,
      label: t("common.navigation.about"),
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    void navigate(key);
    onClose?.();
  };

  const handleLanguageChange = (lang: string) => {
    void i18n.changeLanguage(lang);
  };

  if (isDrawer) {
    return (
      <Flex vertical gap={0} style={{ height: "100%" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-0"
          style={{ flex: 1 }}
        />

        <Divider style={{ margin: "8px 0" }} />

        <Flex vertical gap={12} style={{ padding: "8px 0" }}>
          <Flex align="center" justify="space-between" style={{ padding: "8px 16px" }}>
            <Flex align="center" gap={8}>
              {theme === "dark" ? (
                <MoonOutlined style={{ fontSize: 18 }} />
              ) : (
                <SunOutlined style={{ fontSize: 18 }} />
              )}
              <span>{t(`common.tooltips.themeToggle.${theme}`)}</span>
            </Flex>
            <ThemeToggle />
          </Flex>

          <Flex align="center" justify="space-between" style={{ padding: "8px 16px" }}>
            <Flex align="center" gap={8}>
              <GlobalOutlined style={{ fontSize: 18 }} />
              <span>{t("common.tooltips.languageToggle")}</span>
            </Flex>
            <Flex gap={8}>
              <Button
                type={i18n.language === "zh-CN" ? "primary" : "default"}
                size="small"
                onClick={() => handleLanguageChange("zh-CN")}
              >
                中文
              </Button>
              <Button
                type={i18n.language === "en-US" ? "primary" : "default"}
                size="small"
                onClick={() => handleLanguageChange("en-US")}
              >
                EN
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex gap={12} align="center">
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-0 bg-transparent"
        style={{ flex: 1, minWidth: 0 }}
      />

      <Space
        size="small"
        className="border-l border-gray-200 dark:border-gray-700 pl-4 flex-shrink-0"
      >
        <ThemeToggle />
        <LanguageSelector />
      </Space>
    </Flex>
  );
};

NavigationMenu.displayName = "NavigationMenu";
