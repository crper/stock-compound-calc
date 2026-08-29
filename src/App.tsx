import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/theme";
import { MainLayout } from "@/components/layout";
import { PageLoading } from "@/components/shared/ui";
import "@/index.css";
import React, { Suspense, lazy } from "react";

// 路由级代码分割：首屏只下载连板计算器，回本计算器与关于页按需加载
const StockCalculator = lazy(async () => {
  const module = await import("@/pages/StockCalculator");
  return { default: module.StockCalculator };
});
const LossRecoveryCalculator = lazy(async () => {
  const module = await import("@/pages/LossRecoveryCalculator");
  return { default: module.LossRecoveryCalculator };
});
const About = lazy(async () => {
  const module = await import("@/pages/About");
  return { default: module.About };
});

// App 主组件
export const App: React.FC = React.memo(() => {
  return (
    <HashRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageLoading />}>
                  <StockCalculator />
                </Suspense>
              }
            />
            <Route
              path="/recovery"
              element={
                <Suspense fallback={<PageLoading />}>
                  <LossRecoveryCalculator />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageLoading />}>
                  <About />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
});

App.displayName = "App";
