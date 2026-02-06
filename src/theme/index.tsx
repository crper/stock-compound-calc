import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { theme as antTheme, type ThemeConfig, ConfigProvider, App } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n";

// 主题类型
export type ThemeMode = "light" | "dark";

// 主题上下文类型
interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  antThemeConfig: ThemeConfig;
}

// 本地存储键
const THEME_STORAGE_KEY = "app-theme";

// 主题颜色常量
const THEME_COLORS = {
  primary: "#667eea",
  primaryHover: "#764ba2",
  primaryActive: "#5a67d8",
};

// 深色模式 token
const DARK_TOKENS = {
  colorBgContainer: "#1f2937",
  colorBgElevated: "#374151",
  colorText: "#f3f4f6",
  colorTextSecondary: "#d1d5db",
  colorBorder: "#4b5563",
};

// 默认字体
const DEFAULT_FONT_FAMILY = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Ant Design locale 映射
const antLocales = {
  [LANGUAGES.ZH_CN]: zhCN,
  [LANGUAGES.EN_US]: enUS,
};

// ThemeProvider 组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as ThemeMode) || "light";
  });

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as keyof typeof antLocales;
  const antLocale = antLocales[currentLanguage] || enUS;

  // 切换主题
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // 同步主题到 DOM 和 localStorage
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // 使用 useMemo 缓存主题配置
  const antThemeConfig: ThemeConfig = useMemo(
    () => ({
      algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: THEME_COLORS.primary,
        colorPrimaryHover: THEME_COLORS.primaryHover,
        colorPrimaryActive: THEME_COLORS.primaryActive,
        borderRadius: 8,
        fontFamily: DEFAULT_FONT_FAMILY,
        ...(theme === "dark" ? DARK_TOKENS : {}),
      },
      components: {
        Layout: {
          headerBg: theme === "dark" ? "#1f2937" : "#ffffff",
          headerHeight: 64,
          siderBg: theme === "dark" ? "#1a1a1a" : "#ffffff",
        },
        Card: {
          borderRadiusLG: 12,
          borderRadius: 12,
          boxShadow:
            theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
          colorBgContainer: theme === "dark" ? "#1f2937" : "#fff",
        },
        Button: {
          borderRadius: 8,
          borderRadiusLG: 10,
          borderRadiusSM: 6,
        },
        Input: {
          borderRadius: 8,
          colorBgContainer: theme === "dark" ? "#374151" : "#fff",
          colorBorder: theme === "dark" ? "#4b5563" : "#d9d9d9",
          colorText: theme === "dark" ? "#f3f4f6" : "#000",
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#bfbfbf",
          activeBorderColor: theme === "dark" ? "#667eea" : "#4096ff",
          hoverBorderColor: theme === "dark" ? "#5a67d8" : "#4096ff",
        },
        InputNumber: {
          borderRadius: 10,
          colorBgContainer: theme === "dark" ? "#374151" : "#fff",
          colorBorder: theme === "dark" ? "#4b5563" : "#d9d9d9",
          colorText: theme === "dark" ? "#f3f4f6" : "#000",
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#bfbfbf",
          activeBorderColor: theme === "dark" ? "#667eea" : "#4096ff",
          hoverBorderColor: theme === "dark" ? "#5a67d8" : "#4096ff",
        },
        Slider: {
          colorPrimary: THEME_COLORS.primary,
          controlSize: 12,
          dotSize: 8,
          trackBg: theme === "dark" ? "#4b5563" : "#e1e1e1",
          railBg: theme === "dark" ? "#374151" : "#f5f5f5",
          handleColor: theme === "dark" ? "#667eea" : "#fff",
          handleBorderColor: theme === "dark" ? "#667eea" : "#e5e5e5",
        },
        Tag: {
          borderRadius: 12,
        },
        Alert: {
          borderRadius: 12,
          colorErrorBgFilled: theme === "dark" ? "rgba(207, 19, 34, 0.15)" : "#fff2f0",
          colorInfoBgFilled: theme === "dark" ? "rgba(15, 23, 42, 0.15)" : "#e6f7ff",
          colorWarningBgFilled: theme === "dark" ? "rgba(250, 140, 22, 0.15)" : "#fffbe6",
          colorSuccessBgFilled: theme === "dark" ? "rgba(34, 197, 94, 0.15)" : "#f6ffed",
        },
        Drawer: {
          borderRadius: 12,
          colorBgElevated: theme === "dark" ? "#1f2937" : "#fff",
        },
        Segmented: {
          borderRadius: 8,
          trackPadding: 2,
        },
        Form: {
          labelColor: theme === "dark" ? "#f3f4f6" : "#000",
          labelFontSize: 14,
          itemMarginBottom: 16,
        },
        Typography: {
          colorText: theme === "dark" ? "#f3f4f6" : "#000",
          colorTextSecondary: theme === "dark" ? "#d1d5db" : "#8c8c8c",
        },
      },
    }),
    [theme],
  );

  // 使用 useMemo 缓存上下文值
  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      antThemeConfig,
    }),
    [theme, toggleTheme, antThemeConfig],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={antThemeConfig} locale={antLocale}>
        <App>{children}</App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
});

ThemeProvider.displayName = "ThemeProvider";

// useTheme hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
