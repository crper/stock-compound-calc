import React from "react";
import { Button, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/client/theme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip title={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}>
      <Button
        shape="circle"
        icon={theme === "light" ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        className="border-none bg-transparent"
        style={{ color: theme === "light" ? "#f59e0b" : "#fbbf24" }}
      />
    </Tooltip>
  );
};
