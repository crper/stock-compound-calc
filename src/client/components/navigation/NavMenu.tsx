import React from "react";
import { Tabs } from "antd";
import { LineChartOutlined, CalculatorOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

interface NavMenuProps {
  isMobile?: boolean;
}

export const NavMenu: React.FC<NavMenuProps> = React.memo(({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const items = [
    {
      key: "/",
      label: isMobile ? "股价连板" : "股价连板计算器",
      icon: <LineChartOutlined />,
    },
    {
      key: "/recovery",
      label: isMobile ? "亏损回本" : "亏损回本计算器",
      icon: <CalculatorOutlined />,
    },
  ];

  const handleTabChange = (key: string) => {
    void navigate(key);
  };

  return (
    <div className="w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <Tabs
        activeKey={currentPath}
        onChange={handleTabChange}
        items={items}
        centered
        size={isMobile ? "small" : "middle"}
        className="dark:text-gray-100"
        tabBarStyle={{
          margin: 0,
          padding: isMobile ? "8px 8px 0" : "12px 16px 0",
        }}
      />
    </div>
  );
});

NavMenu.displayName = "NavMenu";
