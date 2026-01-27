import { StockCalculator } from "@/client/pages/StockCalculator";
import { QueryProvider } from "@/client/components/QueryProvider";
import { ThemeProvider } from "@/client/theme";
import "@/client/index.css";

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <StockCalculator />
          <footer className="text-center mt-4 sm:mt-8 py-2 sm:py-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            <p>©2024 股价收益计算器 | 仅供参考，不构成投资建议</p>
          </footer>
        </div>
      </ThemeProvider>
    </QueryProvider>
  );
};

App.displayName = "App";
