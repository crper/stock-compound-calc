import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StockCalculator } from "@/pages/StockCalculator";
import { LossRecoveryCalculator } from "@/pages/LossRecoveryCalculator";
import { About } from "@/pages/About";
import { ThemeProvider } from "@/theme";
import "@/index.css";
import React from "react";
import { useTranslation } from "react-i18next";

// 页脚组件 - 独立提取以便复用和优化
const Footer: React.FC = React.memo(() => {
  const { t } = useTranslation();
  return (
    <footer className="text-center mt-4 sm:mt-8 py-2 sm:py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
      <p>
        {t("common.footer.copyright")} | {t("common.footer.disclaimer")}
      </p>
    </footer>
  );
});

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
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
});

App.displayName = "App";
