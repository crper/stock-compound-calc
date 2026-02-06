import React from "react";
import { Button, Tooltip } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/theme";
import { useTranslation } from "react-i18next";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Tooltip
      title={
        theme === "light"
          ? t("common.tooltips.themeToggle.dark")
          : t("common.tooltips.themeToggle.light")
      }
    >
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
