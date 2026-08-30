/**
 * 现代化的主布局组件 - 使用 Ant Design Layout 系统
 * 统一管理 Header、Content、Footer 布局
 * 桌面端/平板端：水平导航菜单；手机端：底部 TabBar（小程序风格）
 */
import React, { useEffect, useRef } from "react";
import { Layout, Button, Flex } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";
import { useResponsive } from "@/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/theme";
import { LANGUAGES, type Language } from "@/i18n";
import { BACKGROUND_COLORS } from "@/constants/colors";
import { CONTENT_MAX_WIDTH } from "@/constants/layout";
import { HeaderContent } from "./HeaderContent";
import { FooterContent } from "./FooterContent";
import { NavigationMenu } from "./NavigationMenu";
import { MobileTabBar } from "./MobileTabBar";

export const MainLayout: React.FC = React.memo(() => {
  const { isMobile } = useResponsive();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // 路由切换后把滚动位置恢复到顶部，并让主内容重新获得焦点，
  // 否则从长页面跳转后会停在半屏位置，键盘/读屏用户会丢失上下文
  const mainRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    mainRef.current?.focus({ preventScroll: true });
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- 故意依赖 pathname：路由切换时恢复滚动并重新聚焦，effect 内无需读取 pathname
  }, [pathname]);

  const nextLanguage: Language =
    i18n.language === LANGUAGES.ZH_CN ? LANGUAGES.EN_US : LANGUAGES.ZH_CN;

  return (
    <Layout
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor:
          theme === "dark" ? BACKGROUND_COLORS.base.dark : BACKGROUND_COLORS.base.light,
        backgroundImage: theme === "dark" ? BACKGROUND_COLORS.dark : BACKGROUND_COLORS.light,
      }}
    >
      {/* 键盘用户的跳转链接：视觉隐藏，获得焦点时显示在顶部 */}
      <a href="#main-content" className="skip-to-content">
        {t("common.a11y.skipToContent", { defaultValue: "跳转到主要内容" })}
      </a>

      {/* 头部区域：吸顶 + 毛玻璃，滚动时内容从背景透出，更现代的沉浸感 */}
      <Layout.Header
        className="app-header shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
        style={{
          padding: "0 16px",
          height: isMobile ? "56px" : "64px",
          lineHeight: isMobile ? "56px" : "64px",
          backgroundColor: theme === "dark" ? "rgba(15, 18, 36, 0.78)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(14px) saturate(1.6)",
          WebkitBackdropFilter: "blur(14px) saturate(1.6)",
        }}
      >
        <Flex justify="space-between" align="center" style={{ height: "100%" }}>
          {/* 左侧：Logo + 标题 */}
          <div style={{ flex: "0 0 auto", lineHeight: "normal" }} className="min-w-0">
            <HeaderContent />
          </div>

          {/* 右侧：桌面/平板端导航菜单 / 手机端主题 + 语言快捷切换 */}
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

      {/* 内容区域：手机端预留底部 TabBar 空间。
          注意：antd 的 Layout.Content 本身就渲染成 <main>，这里直接复用它，
          不要再嵌套一层 <main>，否则会出现重复/嵌套的 main landmark */}
      <Layout.Content
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-10 ${isMobile ? "py-5 pb-24" : "py-10"}`}
        style={{ maxWidth: CONTENT_MAX_WIDTH }}
      >
        <Outlet />
      </Layout.Content>

      {/* 底部区域 */}
      <Layout.Footer
        className={`text-gray-500 dark:text-gray-400 border-t border-gray-200/70 dark:border-gray-700/60 backdrop-blur-sm ${
          isMobile ? "!py-4 !pb-24" : ""
        }`}
      >
        <FooterContent />
      </Layout.Footer>

      {/* 移动端底部导航 */}
      {isMobile && <MobileTabBar />}
    </Layout>
  );
});

MainLayout.displayName = "MainLayout";
