import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StockCalculator } from "@/pages/StockCalculator";
import { LossRecoveryCalculator } from "@/pages/LossRecoveryCalculator";
import { About } from "@/pages/About";
import { ThemeProvider } from "@/theme";
import { MainLayout } from "@/components/layout";
import "@/index.css";
import React from "react";

// App 主组件
export const App: React.FC = React.memo(() => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<StockCalculator />} />
            <Route path="/recovery" element={<LossRecoveryCalculator />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
});

App.displayName = "App";
