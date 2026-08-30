# Changelog

本项目基于 Keep a Changelog，版本遵循语义化版本控制（SemVer）。

## [Unreleased]

### 重构

- **布局扁平化：移除「卡套卡」嵌套**：删除 `PageContainer` / `ContentCard` / `BackgroundDecor` 三个壳组件，计算页内容卡片直接上浮于品牌氛围光（aurora）背景，层级更扁平、留白更激进。
- **响应式断点委托 antd**：`useResponsive` 改为基于 antd `Grid.useBreakpoint()`（matchMedia），删除自实现的 matchMedia 订阅逻辑与断点常量。
- **字段校验下沉到 Zod**：`validator.getFieldValidationKey` 改为从 `schema.shape[field].safeParse().issues` 推导翻译键，删除手写的 `CALCULATION_LIMITS` 边界 switch，约束边界只在 Zod schema 一处声明。
- **品牌色单一数据源**：品牌色（indigo→violet）收口到 `src/index.css` 的 Tailwind `@theme` token（`brand` / `brand-deep` / `brand-border` / `brand-soft`），替换散落各处的 15+ 处 hex 任意值与内联渐变；`PRIMARY_COLORS` 收敛为仅投影。

### 修复

- **初始市值精度**：`CalculationForm` 初始市值展示由 JS `Number` 直接乘法改为 Decimal.js 计算（经 `.toString()` 中转），消除浮点与超安全整数的精度隐患。

### 清理

- 移除无消费的 `useResponsive` 返回字段（`isTablet`/`isDesktop`/`fontSize`）、死导出（`LANGUAGE_NAMES`、`formatNumber` 外部导出、`isValidLossPercent`）、死字段（`LAYOUT_CONSTANTS.breakpoints/gutter/maxWidth/pagePadding`、`UI_CONSTANTS` 断点、`DEFAULT_VALUES.STOCK_QUANTITY`、`TREND_COLORS.*.divider`、`PRIMARY_COLORS.gradient/softGradient/start/end/tailwind`）。
- 修复 antd 废弃 API（`Alert onClose` → `closable.onClose`、`Spin wrapperClassName` → `classNames.root`）。
- 整体留白与卡片内边距放大（桌面主内容 `py-10/px-10`、卡片内边距 36px）。

## [1.0.0] - 初始版本

- 连板收益计算器（涨停/跌停双向、年化收益率、多图表可视化、历史记录、红涨绿跌配色）。
- 亏损回本计算器（回本涨幅/倍数、1%-100% 速查表、难度评估、防抖保存）。
- 中英文国际化（i18next 类型安全模式、浏览器自动检测 + 持久化）。
- 响应式 SPA（HashRouter、桌面导航 / 移动端底部 TabBar、深色模式、安全区适配）。
- IndexedDB 本地持久化（Dexie + Repository + `useLiveQuery`），无后端。
- Vite+（`vp`）统一工具链：构建 / 测试 / oxlint / oxfmt，GitHub Pages 自动部署。
