/**
 * 导航菜单组件 - 使用 Ant Design Menu 系统
 * 提供响应式导航功能
 */
import { Menu, Space, Flex } from "antd";
import {
  LineChartOutlined,
  CalculatorOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageSelector } from "@/components/navigation/LanguageSelector";

interface NavigationMenuProps {
  onClose?: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
      
      <Space size="small" className="border-l border-gray-200 dark:border-gray-700 pl-4 flex-shrink-0">
        <ThemeToggle />
        <LanguageSelector />
      </Space>
    </Flex>
  );
};

NavigationMenu.displayName = "NavigationMenu";
