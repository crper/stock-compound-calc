/**
 * 内容卡片容器
 * 统一主内容区域的卡片样式
 */
import { Card } from "antd";
import React from "react";
import { useResponsive } from "@/hooks/useResponsive";

interface ContentCardProps {
  children: React.ReactNode;
  minCardHeight?: string;
  padding?: number;
}

export const ContentCard: React.FC<ContentCardProps> = React.memo(
  ({ children, minCardHeight, padding = 28 }) => {
    const { isMobile } = useResponsive();

    return (
      <Card
        className={`flex flex-col rounded-2xl border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-md ${minCardHeight ? "" : "min-h-[calc(100vh-140px)]"}`}
        styles={{
          body: {
            padding: isMobile ? 20 : padding,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          },
        }}
      >
        {children}
      </Card>
    );
  }
);

ContentCard.displayName = "ContentCard";
