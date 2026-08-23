/**
 * 移动端底部导航栏 - 小程序风格 TabBar
 * 为后续移植小程序提供一致的导航交互
 */
import React from "react";
import { LineChartOutlined, CalculatorOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TabItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey:
    | "common.navigation.stockCalculator"
    | "common.navigation.lossRecovery"
    | "common.navigation.about";
}

const TABS: TabItem[] = [
  { path: "/", icon: LineChartOutlined, labelKey: "common.navigation.stockCalculator" },
  { path: "/recovery", icon: CalculatorOutlined, labelKey: "common.navigation.lossRecovery" },
  { path: "/about", icon: InfoCircleOutlined, labelKey: "common.navigation.about" },
];

export const MobileTabBar: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="mobile-tab-bar" aria-label={t("common.navigation.menuTitle")}>
      {TABS.map(({ path, icon: Icon, labelKey }) => {
        const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return (
          <button
            key={path}
            type="button"
            className={`mobile-tab-bar-item ${isActive ? "mobile-tab-bar-item-active" : ""}`}
            onClick={() => {
              if (!isActive) void navigate(path);
            }}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="text-[20px] leading-none" />
            <span className="text-[11px] leading-tight">{t(labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
});

MobileTabBar.displayName = "MobileTabBar";
