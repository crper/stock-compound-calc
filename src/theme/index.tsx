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
// 说明：装饰性渐变仍用 #667eea → #764ba2（品牌观感），
// 但交互主色改用更深一档的 #5a67d8 —— 白字在 #667eea 上只有 3.66:1，
// 达不到 WCAG AA 的 4.5:1；#5a67d8 可达 4.78:1。
// hover / active 继续加深（而非变浅），保证任何状态下的对比度都不过线。
const THEME_COLORS = {
  primary: "#5a67d8",
  primaryHover: "#4c51bf",
  primaryActive: "#4338ca",
  /** 选中态文字色：在浅色背景上需独立满足 AA，不能直接用主色 */
  selectedText: "#4c51bf",
  selectedTextDark: "#a5b4fc",
  selectedBg: "#eef2ff",
  selectedBgDark: "rgba(90, 103, 216, 0.18)",
};

// 深色模式 token
const DARK_TOKENS = {
  colorBgContainer: "#1f2937",
  colorBgElevated: "#374151",
  colorText: "#f3f4f6",
  colorTextSecondary: "#d1d5db",
  colorBorder: "#4b5563",
};

// 辅助文字色：antd 默认的 colorTextSecondary/Tertiary 是 rgba(0,0,0,.65)/(.45)，
// 后者在白色底上只有约 3.5:1，达不到 WCAG AA。这里提到 #595959（≈6.9:1）与 #6b7280（≈4.9:1）。
const LIGHT_TEXT_TOKENS = {
  colorTextSecondary: "#595959",
  colorTextTertiary: "#6b7280",
};

// 默认字体
const DEFAULT_FONT_FAMILY = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider 组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    // 显式校验存储值，避免 localStorage 被手改成任意字符串
    return savedTheme === "dark" ? "dark" : "light";
  });

  const { i18n } = useTranslation();
  // 不做断言：直接用显式比较映射到 AntD locale，未知语言兜底英文
  const antLocale = i18n.language === LANGUAGES.ZH_CN ? zhCN : enUS;

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
        // 聚焦描边：品牌色柔化，统一输入框 / 按钮 / 滑块的焦点反馈
        controlOutline: "rgba(90, 103, 216, 0.22)",
        ...(theme === "dark" ? DARK_TOKENS : LIGHT_TEXT_TOKENS),
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
          // 分层柔和阴影（现代感）：浅层描边 + 远端漫射
          boxShadow:
            theme === "dark"
              ? "0 1px 2px rgba(0, 0, 0, 0.4), 0 10px 28px -10px rgba(0, 0, 0, 0.55)"
              : "0 1px 2px rgba(17, 24, 39, 0.06), 0 8px 24px -8px rgba(17, 24, 39, 0.1)",
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
          activeBorderColor: theme === "dark" ? "#a5b4fc" : "#667eea",
          hoverBorderColor: theme === "dark" ? "#8b9cf7" : "#a5b4fc",
        },
        InputNumber: {
          borderRadius: 10,
          colorBgContainer: theme === "dark" ? "#374151" : "#fff",
          colorBorder: theme === "dark" ? "#4b5563" : "#d9d9d9",
          colorText: theme === "dark" ? "#f3f4f6" : "#000",
          colorTextPlaceholder: theme === "dark" ? "#6b7280" : "#bfbfbf",
          activeBorderColor: theme === "dark" ? "#a5b4fc" : "#667eea",
          hoverBorderColor: theme === "dark" ? "#8b9cf7" : "#a5b4fc",
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
        Menu: {
          // 选中项文字直接用主色会在深色下对比不足：
          // antd 的深色算法会把 #5a67d8 压到 #505bbb（深底上仅 2.49:1）。
          // 这里为垂直 / 水平菜单分别指定满足 AA 的选中色。
          itemSelectedColor:
            theme === "dark" ? THEME_COLORS.selectedTextDark : THEME_COLORS.selectedText,
          itemSelectedBg: theme === "dark" ? THEME_COLORS.selectedBgDark : THEME_COLORS.selectedBg,
          horizontalItemSelectedColor:
            theme === "dark" ? THEME_COLORS.selectedTextDark : THEME_COLORS.selectedText,
          horizontalItemSelectedBg:
            theme === "dark" ? THEME_COLORS.selectedBgDark : THEME_COLORS.selectedBg,
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
