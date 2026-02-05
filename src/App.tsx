import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StockCalculator } from "@/pages/StockCalculator";
import { LossRecoveryCalculator } from "@/pages/LossRecoveryCalculator";
import { ThemeProvider } from "@/theme";
import "@/index.css";
import React from "react";

// 页脚组件 - 独立提取以便复用和优化
const Footer: React.FC = React.memo(() => (
  <footer className="text-center mt-4 sm:mt-8 py-2 sm:py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
    <p>©2026 股价收益计算器 | 仅供参考，不构成投资建议</p>
  </footer>
));

Footer.displayName = "Footer";

// App 主组件
export const App: React.FC = React.memo(() => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<StockCalculator />} />
            <Route path="/recovery" element={<LossRecoveryCalculator />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
});

App.displayName = "App";
