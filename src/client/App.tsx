import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StockCalculator } from "@/client/pages/StockCalculator";
import { LossRecoveryCalculator } from "@/client/pages/LossRecoveryCalculator";
import { QueryProvider } from "@/client/components/QueryProvider";
import { ThemeProvider } from "@/client/theme";
import "@/client/index.css";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Routes>
              <Route path="/" element={<StockCalculator />} />
              <Route path="/recovery" element={<LossRecoveryCalculator />} />
            </Routes>
            <footer className="text-center mt-4 sm:mt-8 py-2 sm:py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              <p>©2024 股价收益计算器 | 仅供参考，不构成投资建议</p>
            </footer>
          </div>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  );
};

App.displayName = "App";
