import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { theme as antTheme, type ThemeConfig, ConfigProvider, App } from "antd";

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

// ThemeProvider 组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as ThemeMode) || "light";
  });

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
        Card: {
          borderRadiusLG: 12,
          borderRadius: 12,
          boxShadow:
            theme === "dark" ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
        Button: {
          borderRadius: 8,
          borderRadiusLG: 10,
          borderRadiusSM: 6,
        },
        Input: {
          borderRadius: 8,
        },
        Slider: {
          colorPrimary: THEME_COLORS.primary,
          controlSize: 12,
          dotSize: 8,
        },
        Tag: {
          borderRadius: 12,
        },
        Alert: {
          borderRadius: 12,
        },
        Drawer: {
          borderRadius: 12,
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
      <ConfigProvider theme={antThemeConfig}>
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
