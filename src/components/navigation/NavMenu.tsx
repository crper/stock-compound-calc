import React from "react";
import { Tabs } from "antd";
import { LineChartOutlined, CalculatorOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface NavMenuProps {
  isMobile?: boolean;
}

export const NavMenu: React.FC<NavMenuProps> = React.memo(({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const currentPath = location.pathname;

  const items = [
    {
      key: "/",
      label: isMobile
        ? t("common.navigation.stockCalculator").slice(0, 4)
        : t("common.navigation.stockCalculator"),
      icon: <LineChartOutlined />,
    },
    {
      key: "/recovery",
      label: isMobile
        ? t("common.navigation.lossRecovery").slice(0, 4)
        : t("common.navigation.lossRecovery"),
      icon: <CalculatorOutlined />,
    },
    {
      key: "/about",
      label: t("common.navigation.about"),
      icon: <InfoCircleOutlined />,
    },
  ];

  const handleTabChange = (key: string) => {
    void navigate(key);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Tabs
        activeKey={currentPath}
        onChange={handleTabChange}
        items={items}
        centered={!isMobile}
        size={isMobile ? "small" : "middle"}
        className="dark:text-gray-100"
        tabBarStyle={{
          margin: 0,
          padding: isMobile ? "4px 4px 0" : "8px 16px 0",
          borderBottom: "none",
        }}
        style={
          {
            "--ant-tabs-ink-bar-color": "#667eea",
            "--ant-tabs-tab-active-color": "#667eea",
            "--ant-tabs-tab-hover-color": "#764ba2",
          } as React.CSSProperties
        }
      />
    </div>
  );
});

NavMenu.displayName = "NavMenu";
