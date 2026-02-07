import React from "react";
import { Segmented } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/theme";
import { useResponsive } from "@/hooks/useResponsive";

export const ThemeToggle: React.FC = React.memo(() => {
  const { theme, toggleTheme } = useTheme();
  const { isMobile } = useResponsive();

  const options = [
    {
      label: <SunOutlined />,
      value: "light",
    },
    {
      label: <MoonOutlined />,
      value: "dark",
    },
  ];

  return (
    <Segmented
      value={theme}
      onChange={toggleTheme}
      options={options}
      size={isMobile ? "small" : "large"}
      style={{
        background: "var(--colorBgContainer)",
        border: "1px solid var(--colorBorderSecondary)",
      }}
    />
  );
});

ThemeToggle.displayName = "ThemeToggle";
