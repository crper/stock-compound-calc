/**
 * 现代化的主布局组件 - 使用 Ant Design Layout 系统
 * 统一管理 Header、Content、Footer 布局
 * 桌面端：水平导航菜单；移动端：底部 TabBar（小程序风格）
 */
import React from "react";
import { Layout, Button, Flex } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme";
import { LANGUAGES, type Language } from "@/i18n";
import { HeaderContent } from "./HeaderContent";
import { FooterContent } from "./FooterContent";
import { NavigationMenu } from "./NavigationMenu";
import { MobileTabBar } from "./MobileTabBar";

export const MainLayout: React.FC = () => {
  const { isMobile } = useResponsive();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const nextLanguage: Language =
    i18n.language === LANGUAGES.ZH_CN ? LANGUAGES.EN_US : LANGUAGES.ZH_CN;

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 头部区域 */}
      <Layout.Header
        className={`shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 ${
          isMobile ? "!h-14" : ""
        }`}
        style={{
          padding: "0 16px",
          height: isMobile ? "56px" : "64px",
          lineHeight: isMobile ? "56px" : "64px",
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
        }}
      >
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          {/* 左侧：Logo + 标题 */}
          <div style={{ flex: "0 0 auto", lineHeight: "normal" }} className="min-w-0">
            <HeaderContent />
          </div>

          {/* 右侧：桌面端导航菜单 / 移动端主题 + 语言快捷切换 */}
          <div style={{ flex: "0 0 auto", lineHeight: "normal" }}>
            {isMobile ? (
              <Flex gap={4} align="center">
                <Button
                  type="text"
                  aria-label={t("common.tooltips.themeToggle.light")}
                  icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  className="!h-10 !w-10 text-gray-600 dark:text-gray-300"
                />
                <Button
                  type="text"
                  aria-label={t("common.tooltips.languageToggle")}
                  onClick={() => void i18n.changeLanguage(nextLanguage)}
                  className="!h-10 !min-w-10 !px-2 text-gray-600 dark:text-gray-300 text-sm font-medium"
                >
                  {nextLanguage === LANGUAGES.EN_US ? "EN" : "中"}
                </Button>
              </Flex>
            ) : (
              <NavigationMenu />
            )}
          </div>
        </Flex>
      </Layout.Header>

      {/* 内容区域：移动端预留底部 TabBar 空间 */}
      <Layout.Content className="flex-1">
        <div
          className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${isMobile ? "py-4 pb-24" : "py-8"}`}
          style={{ maxWidth: 1600 }}
        >
          <Outlet />
        </div>
      </Layout.Content>

      {/* 底部区域 */}
      <Layout.Footer
        className={`bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 ${
          isMobile ? "!py-4 !pb-24" : ""
        }`}
      >
        <FooterContent />
      </Layout.Footer>

      {/* 移动端底部导航 */}
      {isMobile && <MobileTabBar />}
    </Layout>
  );
};

MainLayout.displayName = "MainLayout";
