# AGENTS.md - AI 编码指南

**项目:** 股票计算器 (Bun + React 19 + TypeScript + IndexedDB + Dexie + React Router + Tailwind v4 + Ant Design v6)
**最后更新:** 2026-02-04

## 🛠 核心命令

```bash
# 环境搭建与开发
bun install              # 安装依赖
bun dev                  # 启动开发服务器 (端口 3000)
bun run build            # 生产构建 (包含 lint)
bun start                # 生产模式启动

# 代码质量与格式化
bun run lint             # 运行 oxlint (类型感知, 必须通过)
bun run lint:fix         # 自动修复 lint 问题
bun run format           # 使用 oxfmt 格式化代码
bun run format:check     # 检查格式

# 测试
bun test                 # 运行所有测试
bun test -t "pattern"    # 按名称运行特定测试 (TDD 推荐)
bun test -t "功能名称"   # 运行包含中文的测试
bun test --watch         # 监听模式
bun test path/to/test.ts # 运行单个测试文件
bun test:coverage        # 运行测试并生成覆盖率报告
```

## 🎨 视觉效果与交互优化规范

### 设计系统

- **主题系统**: 使用 `ThemeProvider` 统一管理深色/浅色模式切换
- **渐变背景**: 采用 `from-[#667eea] to-[#764ba2]` 主色调搭配
- **毛玻璃效果**: 使用 `bg-white/95 backdrop-blur-md` 创建半透明毛玻璃效果
- **过渡动画**: 所有颜色变化使用 `transition-colors duration-300` 或 `duration-500`
- **阴影效果**: 卡片组件使用 `shadow-lg` 和 `shadow-indigo-500/30`

### 组件交互模式

- **路由导航**: 使用 React Router 实现页面切换，导航组件位于 `src/client/components/navigation/NavMenu.tsx`
- **响应式布局**: 使用 Ant Design 的 `Row`/`Col` 组件实现响应式网格
- **渐进式反馈**: 表单验证采用实时反馈，错误提示使用 Ant Design `Alert`
- **加载状态**: 计算过程中显示加载指示器
- **主题切换**: 支持通过 `ThemeToggle` 组件无缝切换深浅色主题
- **历史记录**: 使用 `Drawer` 组件展示历史记录，配备浮动按钮增强移动端体验
- **数据可视化**: 使用 Recharts 库展示收益趋势图表
- **防抖优化**: 滑动条等高频交互组件使用防抖，避免频繁保存历史记录

### 视觉层次结构

- **标题层级**: 主标题使用渐变文字效果 `bg-gradient-to-br from-[#667eea] to-[#764ba2]`
- **卡片设计**: 圆角 `rounded-xl`，边框 `border border-white/20 dark:border-gray-700/50`
- **按钮样式**: 主要操作按钮使用渐变背景 `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **图标集成**: 使用 Ant Design 图标与自定义装饰元素结合

## 📐 代码风格与规范

### 导入规范

- 使用 `@/` 别名引用内部路径（tsconfig paths 配置）
- 导入分组顺序: `外部库` → `内部模块` → `类型导入`
- 每组之间空一行，同组按字母排序，避免循环依赖

```typescript
// ✅ 正确
import React from "react";
import { Button, Form } from "antd";
import { useLiveQuery } from "dexie-react-hooks";
import { calculationRepository } from "@/client/db/calculationRepository";
import { AppError } from "@/shared/utils/errorHandler";
import type { CalculationParams } from "@/shared/types";
```

### 命名约定

- **组件**: PascalCase (`CalculationForm`, `ResultCard`)
- **函数/变量**: camelCase (`calculateReturns`, `isLoading`)
- **常量**: UPPER_SNAKE_CASE (`MAX_BOARD_COUNT`, `DEFAULT_CONFIG`)
- **类型/接口**: PascalCase (`UserData`, `ApiResponse`)
- **私有成员**: `_camelCase` (带下划线前缀)
- **布尔变量**: `is/has/can` 前缀 (`isValid`, `hasError`, `canSubmit`)

### TypeScript 规范

- **严格模式**: 已启用，禁止 `any` 类型，必要时使用 `unknown`
- **类型定义**: 优先从 Zod schemas 推断 `type T = z.infer<typeof Schema>`
- **避免类型断言**: 优先使用类型守卫和类型窄化
- **可选链和空值合并**: `?.` 和 `??` 优于手动检查
- **泛型**: 优先使用明确约束，避免泛型泄露

```typescript
// ✅ Zod 推断 + 类型守卫
export const CalculationParamsSchema = z.object({
  initialPrice: z.number().min(0.01),
  boardCount: z.number().int().min(1).max(365),
});
export type CalculationParams = z.infer<typeof CalculationParamsSchema>;

function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
```

### React 组件规范

- **仅函数组件**: 禁止类组件
- **命名导出**: 禁止默认导出，使用 `export const Component = ...`
- **Props 类型**: 使用 TypeScript interface，明确标记必需/可选
- **性能优化**: 使用 `React.memo` 包裹导出的 UI 组件
- **解构 Props**: 在函数签名处直接解构，明确依赖
- **关键指标计算**: 包括年化收益率(CAGR)等重要投资指标
- **视觉设计**: 组件需遵循设计系统规范，确保统一的视觉体验

```typescript
export const ResultCard: React.FC<ResultCardProps> = React.memo(({ results, isMobile }) => {
  if (!results) return <Empty description="请先进行计算" />;
  return <Card>...</Card>;
});
ResultCard.displayName = 'ResultCard';
```

### Hooks 规范

- **自定义 Hook**: 以 `use` 开头，使用 PascalCase (`useStockCalculator`)
- **状态管理**: 本地状态用 useState/useReducer，数据用 `useLiveQuery` (Dexie)
- **副作用**: useEffect 依赖数组必须完整，或通过 eslint-disable 注释说明
- **性能**: 大计算使用 useMemo，稳定回调使用 useCallback
- **UI 相关**: 交互逻辑封装到 hooks 中，如 `useResponsive`, `useStockCalculator`

### 错误处理

- **统一错误类型**: 使用 `@/shared/utils/errorHandler` 的 `AppError` 和 `ErrorFactory`
- **未知错误包装**: 所有 catch 块必须用 `ErrorHandler.handleUnknown(error)` 包装
- **Zod 验证失败**: 重新抛出为 AppError (ErrorType.VALIDATION)

```typescript
try {
  const data = CalculationParamsSchema.parse(input);
  return await calculationService.calculate(data);
} catch (error) {
  const appError = ErrorHandler.handleUnknown(error);
  ErrorHandler.log(appError);
  throw appError;
}
```

### 高精度计算

- **必须使用 Decimal.js**: 所有股票价格/收益率计算
- **全局配置**: 使用 `src/shared/constants` 中的 `DECIMAL_CONFIG`
- **类型转换**: Decimal → Number 必须通过 `.toString()` 中转

```typescript
import Decimal from "decimal.js";
Decimal.set(DECIMAL_CONFIG);
const price = new Decimal(initialPrice);
const result = price.mul(new Decimal(dailyReturn).div(100));
```

## 📂 项目结构

```
src/
├── client/          # React 前端
│   ├── components/  # UI 组件
│   ├── db/         # IndexedDB 数据库层 (Dexie)
│   │   ├── dexie.ts                    # 数据库配置
│   │   ├── calculationRepository.ts     # 数据访问层
│   │   └── __tests__/                  # 数据库测试
│   ├── hooks/       # 自定义 Hooks
│   ├── services/    # 业务服务层
│   ├── utils/       # 工具函数 (含客户端计算逻辑)
│   ├── pages/       # 页面组件
│   ├── theme/       # 主题配置
│   └── index.css    # 全局样式和 Tailwind 配置
├── server/          # Bun 静态服务器 (仅入口)
└── shared/          # 共享逻辑 (constants, schemas, types, utils)
```

## 🤖 AI 代理指南 (AI Agent Guidelines)

- **工具选择**: 必须使用 `bun` 而非 `npm`/`yarn`/`pnpm`
- **自我验证**: 完成任务前，必须运行 `bun run lint` 和相关测试
- **文件操作**: 修改现有文件前，先读取内容；创建新文件前，检查目录是否存在
- **配置保护**: 除非明确要求，不要修改 `package.json`, `tsconfig.json` 等配置文件
- **上下文感知**: 在回答问题或编写代码前，先搜索相关代码 (grep/glob) 以保持一致性
- **数据层模式**: 使用 Dexie + Repository 模式进行数据访问
- **响应式查询**: 使用 `useLiveQuery` 而非 React Query
- **视觉一致性**: 任何 UI/UX 变更都必须遵循设计系统规范

### 架构最佳实践

- **纯前端存储**: 所有数据存储在 IndexedDB，无需服务器端数据库
- **类型统一**: 共享类型定义在 `shared/types` 和 `shared/schemas`，避免重复定义
- **常量集中**: 所有配置常量放在 `shared/constants`，禁止硬编码魔法数字
- **性能优化**: `useLiveQuery` 自动响应数据变化，无需手动缓存失效
- **代码精简**: 删除冗余文件和重复配置，不保留 `@deprecated` 兼容代码

## ⚠️ 关键约束

- **禁止** 默认导出 (使用命名导出 `export const Foo = ...`)
- **禁止** 类组件 (仅函数组件)
- **禁止** 已废弃的 Ant Design API (oxlint 会强制拦截)
- **禁止** 在计算中使用 JavaScript Number (必须用 Decimal.js)
- **禁止** `any` 类型 (使用 `unknown` + 类型守卫)
- **必须** 所有 API 输入使用 Zod schema 验证
- **必须** 每次提交前运行 `bun run lint` + `bun run format`
- **必须** 在前端业务逻辑变更时更新或添加 `src/client/services/__tests__` 下的测试
- **必须** 视觉变更保持深色/浅色模式兼容性

## 🎨 Ant Design 主题配置最佳实践

### 主题配置原则

- **统一主色**: 在 `src/client/theme/index.tsx` 中配置 `colorPrimary: "#667eea"`，确保全站颜色一致
- **使用 ConfigProvider**: 所有 Ant Design 组件的样式配置应通过 `ConfigProvider` 的 `components` Token 配置，而非 CSS 覆盖
- **避免内联样式**: 尽可能使用 Ant Design 的 `type="primary"` 等预设样式，避免硬编码渐变或颜色
- **废弃 API 迁移**: 及时更新废弃的 API，如：
  - `Space direction="vertical"` → 使用 `Flex` 组件
  - `Divider type="vertical"` → `Divider orientation="vertical"`
  - `Select options` 中的 `value: null` → `value: undefined`
  - `Statistic valueStyle` → `Statistic styles.content`
  - `Alert message` → `Alert title`

### Form 使用规范

**避免 useForm 警告**

不要在组件渲染期间直接调用 `form.getFieldValue()` 或 `form.getFieldsValue()`，这会导致 "Instance created by `useForm` is not connected" 警告。

```typescript
// ❌ 错误：在渲染期间直接调用
const value = form.getFieldValue("dailyReturn");
<Slider value={form.getFieldValue("dailyReturn")} />

// ✅ 正确：使用 Form.useWatch 监听值
const dailyReturnValue = Form.useWatch("dailyReturn", form);
<Slider value={dailyReturnValue} />
```

**useWatch 使用场景**
- 需要在组件渲染期间读取表单值时
- 需要根据表单值动态更新 UI 时
- 需要在依赖数组中使用表单值时

### 配置示例

```typescript
const antThemeConfig: ThemeConfig = {
  algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  token: {
    colorPrimary: "#667eea",
    colorPrimaryHover: "#764ba2",
    borderRadius: 8,
  },
  components: {
    Card: { borderRadiusLG: 12 },
    Button: { borderRadius: 8 },
    Slider: { colorPrimary: "#667eea" },
  },
};
```

## 🚀 开发流程

1. **准备阶段**: 使用 `grep`/`glob` 研究，设计变更方案
2. **TDD 测试先行**: 在 `__tests__` 编写测试用例
3. **实现阶段**: 遵循代码规范，核心计算用 Decimal.js
4. **视觉优化**: 实现 UI 组件时遵循设计系统规范
5. **本地验证**: `bun test -t "功能"` → `bun run lint` → `bun run format`
6. **最终构建**: `bun run build` 确保生产构建成功

## 📋 代码审查清单 (Review Checklist)

### 提交前必查项

- [ ] **测试通过**: `bun test` 全部通过，无失败用例
- [ ] **Lint 通过**: `bun run lint` 0 warnings, 0 errors
- [ ] **格式正确**: `bun run format:check` 通过
- [ ] **构建成功**: `bun run build` 无错误

### Ant Design 规范检查

- [ ] 无废弃 API 使用（查看浏览器控制台警告）
- [ ] `Space direction` 已替换为 `Flex vertical`
- [ ] `Statistic valueStyle` 已替换为 `styles.content`
- [ ] `Alert message` 已替换为 `title`
- [ ] 使用 `Form.useWatch` 而非 `form.getFieldValue`

### 性能检查

- [ ] 内联样式提取为常量（Slider、Card 等）
- [ ] useCallback 依赖数组完整且正确
- [ ] useMemo 用于昂贵的计算
- [ ] 防抖/节流功能正常工作

### 健壮性检查

- [ ] 边界参数处理（分页、输入验证）
- [ ] 错误处理完善（try-catch + ErrorHandler）
- [ ] 类型安全（无 any，使用 unknown + 类型守卫）
- [ ] Decimal.js 用于所有金融计算
