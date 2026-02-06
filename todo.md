# 国际化与关于页面实施计划

## ✅ 阶段 1：基础设施

- [x] 安装依赖: `react-i18next`, `i18next`, `i18next-browser-languagedetector`
- [x] 创建 `src/i18n/index.ts` - i18n 初始化配置
- [x] 创建 `src/i18n/types.ts` - TypeScript 类型定义
- [x] 创建 `src/i18n/utils.ts` - 语言检测工具
- [x] 更新 `src/main.tsx` - 引入 i18n

## ✅ 阶段 2：翻译文件

- [x] 创建 `src/i18n/locales/zh-CN.ts` - 简体中文翻译
- [x] 创建 `src/i18n/locales/en-US.ts` - 英文翻译
- [x] 翻译内容:
  - [x] common - 通用（导航、按钮、页脚）
  - [x] stockCalculator - 股价连板计算器
  - [x] recoveryCalculator - 亏损回本计算器
  - [x] about - 关于页面
  - [x] validation - 表单验证错误

## ✅ 阶段 3：组件开发

- [x] 创建 `src/components/navigation/LanguageSelector.tsx` - 语言切换组件
- [x] 创建 `src/pages/About.tsx` - 关于页面

## ✅ 阶段 4：集成更新

- [x] 更新 `src/theme/index.tsx` - 集成 Ant Design locale，监听语言变化
- [x] 更新 `src/components/navigation/NavMenu.tsx` - 添加关于导航和语言选择器
- [x] 更新 `src/App.tsx` - 添加关于路由，页脚国际化

## ✅ 阶段 5：组件国际化

- [x] `src/pages/StockCalculator.tsx`
- [x] `src/pages/LossRecoveryCalculator.tsx`
- [x] `src/components/forms/CalculationForm.tsx`
- [x] `src/components/forms/RecoveryForm.tsx`
- [x] `src/components/displays/ResultsDisplay.tsx`
- [x] `src/components/displays/ResultOverviewCard.tsx`
- [x] `src/components/displays/MetricsGrid.tsx`
- [x] `src/components/displays/PositionChangeSection.tsx`
- [x] `src/components/displays/PriceChangeSection.tsx`
- [x] `src/components/displays/HistoryDrawer.tsx`
- [x] `src/components/displays/RecoveryResult.tsx`
- [x] `src/components/displays/RecoveryTable.tsx`
- [x] `src/components/charts/ChartContainer.tsx`
- [x] `src/components/charts/ChartTypeSelector.tsx`
- [x] `src/components/shared/ThemeToggle.tsx`
- [x] `src/schemas/index.ts` - 验证错误
- [x] `src/utils/lossRecovery.ts` - 难度级别

## ✅ 阶段 6：验证

- [x] 运行 `bun run lint`
- [x] 运行 `bun run format`
- [x] 验证中英文切换功能
- [x] 验证 localStorage 持久化
- [x] 验证所有页面显示正常

---

## 语言策略

- **支持语言**: 中文(zh-CN) + 英文(en-US)
- **语言检测**: 浏览器语言 `zh*` 开头 → 中文，其他 → 英文
- **兜底语言**: 英文
- **存储位置**: localStorage (键: `app-language`)

## 配置存储策略

- **IndexedDB** → 业务数据（计算历史、历史筛选状态）
- **localStorage** → 用户偏好（主题、语言）

---

## 实现日期

2026-02-06
