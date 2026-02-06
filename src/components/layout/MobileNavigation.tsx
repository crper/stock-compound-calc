/**
 * 移动端导航组件 - 侧边抽屉式导航
 * 为移动端优化的导航体验
 */
import { Menu } from "antd";
import {
  LineChartOutlined,
  CalculatorOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface MobileNavigationProps {
  visible: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onClose,
}) => {
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
    onClose();
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      className="border-0"
    />
  );
};

MobileNavigation.displayName = "MobileNavigation";