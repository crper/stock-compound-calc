/**
 * 路由级加载占位
 * 用于 React.lazy 懒加载页面时的 Suspense fallback，
 * 保持与主内容卡片一致的垂直节奏，避免加载完成时页面跳动
 */
import { Flex, Spin } from "antd";
import React from "react";

export const PageLoading: React.FC = React.memo(() => (
  // <output> 自带 status 语义，读屏软件会自动播报加载状态
  <output aria-live="polite" className="block w-full">
    <Flex align="center" justify="center" style={{ minHeight: "60vh" }}>
      <Spin size="large" />
    </Flex>
  </output>
));

PageLoading.displayName = "PageLoading";
