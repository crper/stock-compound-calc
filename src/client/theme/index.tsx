import React, { createContext, useContext, useEffect, useState } from "react";
import { theme as antTheme, type ThemeConfig, ConfigProvider } from "antd";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  antThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return (savedTheme as ThemeMode) || "light";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const antThemeConfig: ThemeConfig = {
    algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#667eea",
      colorPrimaryHover: "#764ba2",
      colorPrimaryActive: "#5a67d8",
      borderRadius: 8,
      fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
      ...(theme === "dark"
        ? {
            colorBgContainer: "#1f2937",
            colorBgElevated: "#374151",
            colorText: "#f3f4f6",
            colorTextSecondary: "#d1d5db",
            colorBorder: "#4b5563",
          }
        : {}),
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
        colorPrimary: "#667eea",
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
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, antThemeConfig }}>
      <ConfigProvider theme={antThemeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
