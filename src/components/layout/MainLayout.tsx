/**
 * 现代化的主布局组件 - 使用 Ant Design Layout 系统
 * 统一管理 Header、Content、Footer 布局
 */
import React from "react";
import { Layout, Row, Col, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { HeaderContent } from "./HeaderContent";
import { FooterContent } from "./FooterContent";
import { NavigationMenu } from "./NavigationMenu";
import { LAYOUT_CONSTANTS } from "@/constants/layout";

export interface MainLayoutProps {
  page?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
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
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        style={{ padding: "0 24px" }}
      >
        <Row justify="space-between" align="middle">
          <Col flex="auto">
            <HeaderContent />
          </Col>
          
          {isMobile ? (
            <Col flex="none">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={handleMobileMenuOpen}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              />
            </Col>
          ) : (
            <Col flex="none">
              <NavigationMenu />
            </Col>
          )}
        </Row>
      </Layout.Header>

      {/* 移动端导航抽屉 */}
        <Drawer
          title={t("common.navigation.menuTitle")}
          placement="left"
          closable={true}
          onClose={handleMobileMenuClose}
          open={mobileMenuVisible}
          key="left"
          className="mobile-navigation-drawer"
        >
          <NavigationMenu onClose={handleMobileMenuClose} />
        </Drawer>

      {/* 内容区域 */}
      <Layout.Content className="flex-1">
        <div
          className="mx-auto w-full"
          style={{
            marginTop: LAYOUT_CONSTANTS.spacing.xxxl,
            marginBottom: LAYOUT_CONSTANTS.spacing.xxxl,
          }}
        >
          {/* 路由出口 - 子页面内容 */}
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