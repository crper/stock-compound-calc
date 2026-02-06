import React from "react";
import { Segmented } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/theme";

export const ThemeToggle: React.FC = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

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
      size="large"
      style={{
        background: "var(--colorBgContainer)",
        border: "1px solid var(--colorBorderSecondary)",
      }}
    />
  );
});

ThemeToggle.displayName = "ThemeToggle";
