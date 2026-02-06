/**
 * 页面统一容器组件
 * 整合背景装饰、导航菜单、内容卡片
 * 消除页面级布局重复
 */
import React from "react";
import { BackgroundDecor } from "./BackgroundDecor";
import { ContentCard } from "./ContentCard";
import { LAYOUT_CONSTANTS } from "@/constants/layout";
import { useResponsive } from "@/hooks/useResponsive";

interface PageContainerProps {
  children: React.ReactNode;
  navMenu?: React.ReactNode;
  minCardHeight?: string;
}

export const PageContainer: React.FC<PageContainerProps> = React.memo(
  ({ children, navMenu, minCardHeight }) => {
    const { isMobile } = useResponsive();
    const pagePadding = isMobile
      ? LAYOUT_CONSTANTS.pagePadding.mobile
      : LAYOUT_CONSTANTS.pagePadding.desktop;

    return (
      <div className="w-full relative overflow-hidden">
        {/* 背景装饰 */}
        <BackgroundDecor />

        {/* 导航菜单容器 */}
        {navMenu && (
          <div className="relative z-10 mb-6">
            {navMenu}
          </div>
        )}

        {/* 主内容卡片 */}
        <div className="relative z-10">
          <ContentCard minCardHeight={minCardHeight} padding={pagePadding}>
            {children}
          </ContentCard>
        </div>
      </div>
    );
  }
);

PageContainer.displayName = "PageContainer";
