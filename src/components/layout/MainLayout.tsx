/**
 * 现代化的主布局组件 - 使用 Ant Design Layout 系统
 * 统一管理 Header、Content、Footer 布局
 */
import React from "react";
import { Layout, Button, Flex, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme";
import { HeaderContent } from "./HeaderContent";
import { FooterContent } from "./FooterContent";
import { NavigationMenu } from "./NavigationMenu";

export const MainLayout: React.FC = () => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [mobileMenuVisible, setMobileMenuVisible] = React.useState(false);

  const handleMobileMenuClose = () => {
    setMobileMenuVisible(false);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuVisible(true);
  };

  return (
    <Layout className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 头部区域 */}
      <Layout.Header
        className="shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
        style={{
          padding: "0 16px",
          height: "64px",
          lineHeight: "64px",
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
        }}
      >
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          {/* 左侧：Logo + 标题 */}
          <div style={{ flex: "0 0 auto", lineHeight: "normal" }}>
            <HeaderContent />
          </div>

          {/* 右侧：导航菜单 或 汉堡按钮 */}
          <div style={{ flex: "0 0 auto", lineHeight: "normal" }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={handleMobileMenuOpen}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              />
            ) : (
              <NavigationMenu />
            )}
          </div>
        </Flex>
      </Layout.Header>

      {/* 移动端导航抽屉 */}
      <Drawer
        title={t("common.navigation.menuTitle")}
        placement="left"
        closable={true}
        onClose={handleMobileMenuClose}
        open={mobileMenuVisible}
        className="mobile-navigation-drawer"
        size="default"
        styles={{
          body: { padding: "16px" },
        }}
      >
        <NavigationMenu isDrawer onClose={handleMobileMenuClose} />
      </Drawer>

      {/* 内容区域 */}
      <Layout.Content className="flex-1">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1600 }}>
          <Outlet />
        </div>
      </Layout.Content>

      {/* 底部区域 */}
      <Layout.Footer className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <FooterContent />
      </Layout.Footer>
    </Layout>
  );
};

MainLayout.displayName = "MainLayout";
