# AGENTS.md - AI 编码指南

**项目:** 股票计算器 (Bun + React 19 + TypeScript + IndexedDB + Dexie + React Router + Tailwind v4 + Ant Design v6 + i18next)
**最后更新:** 2026-02-12

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
bun test -t "功能名称"     # 运行包含中文的测试
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

- **路由导航**: 使用 HashRouter（GitHub Pages 子路径友好），桌面端用 `src/components/layout/NavigationMenu.tsx`，移动端用 `src/components/layout/MobileTabBar.tsx`
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
import { calculationRepository } from "@/db/calculationRepository";
import { AppError } from "@/utils/errorHandler";
import type { CalculationParams } from "@/types";
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
- **全局配置**: 使用 `src/constants` 中的 `DECIMAL_CONFIG`
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
├── components/      # UI 组件
│   ├── charts/      # 图表组件
│   ├── displays/    # 展示组件
│   ├── forms/       # 表单组件
│   ├── navigation/  # 导航组件
│   └── shared/      # 共享组件
├── db/              # IndexedDB 数据库层 (Dexie)
│   ├── dexie.ts                    # 数据库配置
│   ├── calculationRepository.ts     # 数据访问层
│   └── __tests__/                  # 数据库测试
├── hooks/           # 自定义 Hooks
├── i18n/            # 国际化配置
│   ├── index.ts                    # i18n 初始化
│   ├── types.ts                    # 翻译类型定义
│   └── locales/                    # 翻译文件
│       ├── zh-CN.ts                # 简体中文
│       └── en-US.ts                # 英文
├── services/        # 业务服务层
│   └── __tests__/                  # 服务测试
├── utils/           # 工具函数
├── constants/       # 常量定义
├── schemas/         # Zod schemas
├── types/           # TypeScript 类型
├── pages/           # 页面组件
├── theme/           # 主题配置
├── App.tsx          # 根组件
└── main.tsx         # 应用入口
```

## 🤖 Oxlint 配置指南

### 配置文件结构

项目使用 `oxlint.json` 配置文件，支持类型感知 lint 和代码质量检查。

### 核心配置说明

#### Plugins（插件）

oxlint 原生支持多个主流插件，无需额外安装：

```json
{
  "plugins": ["unicorn", "typescript", "oxc", "react", "jsx-a11y", "promise", "react-hooks"]
}
```

- **unicorn** (200+ 规则): 现代 JavaScript 最佳实践
- **typescript**: 类型检查和 TypeScript 特定规则
- **react**: React/React Hooks 规则
- **jsx-a11y**: 可访问性规则
- **promise**: 异步代码规范
- **react-hooks**: Hooks 依赖检查

#### Categories（规则分类）

使用 categories 批量管理规则，避免逐条声明：

```json
{
  "categories": {
    "correctness": "error", // 代码错误（必须修复）
    "suspicious": "warn", // 可能有问题（建议修复）
    "style": "warn", // 风格一致性
    "restriction": "off", // 禁止特定模式（关闭）
    "perf": "off", // 性能优化（关闭）
    "nursery": "warn" // 实验性规则（警告级别）
  }
}
```

#### Rules（自定义规则）

仅覆盖关键安全规则，其他由 categories 隐式继承：

```json
{
  "rules": {
    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/consistent-type-imports": "error",
    "react/no-deprecated": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

#### Options（配置选项）

```json
{
  "options": {
    "experimentalSortImports": {
      "newlinesBetween": true,
      "order": "asc",
      "partitionByComment": false,
      "partitionByNewline": false,
      "sortSideEffects": true
    }
  }
}
```

#### Overrides（覆盖规则）

测试文件放宽部分约束：

```json
{
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
}
```

#### Environment（环境配置）

```json
{
  "env": {
    "browser": true, // 浏览器环境
    "es2022": true, // ES2022 语法
    "bun": true // Bun 运行时
  }
}
```

### 使用命令

#### 类型感知检查

```bash
# 类型感知 lint（支持 no-unsafe-* 等类型规则）
bun run lint      # oxlint --type-aware src

# 自动修复
bun run lint:fix  # oxlint --type-aware --fix src
```

#### TypeScript 类型检查

```bash
# 纯类型检查（替代 tsc）
bun run typecheck  # bun run tsc --noEmit
```

### 规则优先级

1. **显式规则**: `rules` 中声明的规则优先级最高
2. **Categories**: 未声明的规则从 categories 继承
3. **插件默认**: plugins 自带的推荐规则
4. **Overrides**: 文件特定覆盖规则

### 常见问题

#### Q: 为什么使用 categories 而不是逐条声明规则？

A: Categories 可以批量管理数百条规则，减少配置复杂度。例如 `correctness: "error"` 会自动启用所有正确性相关的规则。

#### Q: 如何查看 oxlint 支持的所有规则？

A: 运行 `oxlint --help` 查看文档，或访问 https://oxc.rs/docs/guide/usage/linter

#### Q: --type-aware 标志的作用是什么？

A: 启用 TypeScript 类型信息，支持 `no-unsafe-*`、`no-floating-promises` 等需要类型上下文的规则。

#### Q: 如何禁用某条规则？

A: 在 `rules` 中设置 `"rule-name": "off"`，或在特定文件中使用 `// oxlint-disable-next-line` 注释。

### 完整配置示例

```json
{
  "$schema": "https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json",
  "plugins": ["unicorn", "typescript", "oxc", "react", "jsx-a11y", "promise", "react-hooks"],
  "settings": {
    "react": {
      "version": "19.2.3",
      "linkComponents": [{ "name": "Link", "linkAttribute": "to" }]
    },
    "jsx-a11y": {
      "components": { "Link": "a", "Button": "button" }
    }
  },
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "style": "warn",
    "restriction": "off",
    "perf": "off",
    "nursery": "warn"
  },
  "options": {
    "experimentalSortImports": {
      "newlinesBetween": true,
      "order": "asc",
      "partitionByComment": false,
      "partitionByNewline": false,
      "sortSideEffects": true
    }
  },
  "rules": {
    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/consistent-type-imports": "error",
    "react/no-deprecated": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error"
  },
  "env": {
    "browser": true,
    "es2022": true,
    "bun": true
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.test.tsx"],
      "rules": { "no-console": "off" }
    }
  ],
  "ignore": ["dist/**", "node_modules/**", "*.config.js", "*.config.ts", "build.ts", ".iflow/**"]
}
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
- **国际化**: 所有用户界面文本使用 `react-i18next`，支持中英文切换

### 国际化规范

**翻译文件组织**

翻译文件位于 `src/i18n/locales/`，按命名空间组织：

- `common` - 通用文本（导航、按钮、页脚、错误类型）
- `stockCalculator` - 股价连板计算器
- `recoveryCalculator` - 亏损回本计算器
- `about` - 关于页面
- `validation` - 表单验证错误

**文件结构**

```
src/i18n/
├── index.ts          # i18n 初始化与 exports
├── i18next.d.ts      # 类型声明（官方标准模式）
└── locales/
    ├── zh-CN.ts      # 简体中文（使用 as const）
    └── en-US.ts      # 英文（使用 as const）
```

**类型安全实现**

项目使用 i18next 官方类型安全模式，提供完整的 IDE 自动补全：

1. **翻译文件**：使用 `as const` 断言确保字面量类型推断
2. **类型声明**：通过 `i18next.d.ts` 扩展 `CustomTypeOptions` 接口
3. **导出资源**：在 `index.ts` 中导出 `resources` 和 `defaultNS`

**类型声明示例** (`src/i18n/i18next.d.ts`):

```typescript
import "i18next";
import { resources, defaultNS } from "./index";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["zh-CN"];
  }
}
```

**使用示例**

```typescript
import { useTranslation } from "react-i18next";

export const Component: React.FC = () => {
  const { t } = useTranslation();

  // IDE 可提供完整的键值自动补全
  return <Button>{t("common.buttons.confirm")}</Button>;
};
```

**错误处理类型安全**

错误消息使用类型安全的 switch 语句，避免模板字符串类型推断问题：

```typescript
private getErrorTypePrefix(): string {
  switch (this.type) {
    case ErrorType.VALIDATION:
      return i18n.t("common.errors.types.validation");
    case ErrorType.CALCULATION:
      return i18n.t("common.errors.types.calculation");
    case ErrorType.NETWORK:
      return i18n.t("common.errors.types.network");
    case ErrorType.SYSTEM:
      return i18n.t("common.errors.types.system");
  }
}
```

**语言策略**

- 浏览器语言 `zh*` 开头 → 中文，其他 → 英文
- 兜底语言：英文
- 语言偏好持久化到 localStorage（键：`app-language`）

**新增文本规范**

1. 不要直接在组件中写中文或英文硬编码
2. 先在 `zh-CN.ts` 和 `en-US.ts` 中添加对应的翻译键
3. 使用 `t("namespace.key")` 引用翻译
4. 变量插值使用 `t("key", { variable: value })`
5. 新增翻译键后，IDE 自动提供类型检查和补全

## ⚠️ 关键约束

- **禁止** 默认导出 (使用命名导出 `export const Foo = ...`)
- **禁止** 类组件 (仅函数组件)
- **禁止** 已废弃的 Ant Design API (oxlint 会强制拦截)
- **禁止** 在计算中使用 JavaScript Number (必须用 Decimal.js)
- **禁止** `any` 类型 (使用 `unknown` + 类型守卫)
- **禁止** 硬编码中文或英文文本（必须使用 `useTranslation`）
- **必须** 所有 API 输入使用 Zod schema 验证
- **必须** 每次提交前运行 `bun run lint` + `bun run format`
- **必须** 在前端业务逻辑变更时更新或添加 `src/services/__tests__` 下的测试
- **必须** 视觉变更保持深色/浅色模式兼容性
- **必须** 所有用户界面文本使用 i18n 翻译

## 🧹 代码清理记录

### 2026-02-06 - 全面代码重构与优化

**🔴 高优先级清理**

- **删除未使用文件**:
  - `src/utils/logger.ts` - 完全未使用，无任何调用
  - `src/utils/idGenerator.ts` 中的 `generateNumericId()` 和 `generateShortId()` - 未使用的ID生成函数
- **删除未使用常量**:
  - `src/constants/index.ts` 中的 `API_CONSTANTS` 对象 - 完全未使用的API配置
  - `src/constants/limits.ts` 中的 `API_LIMITS` - 未使用的API限制常量
- **清理环境变量**:
  - 删除 `src/config/env.ts` 中的 `HEALTH_CHECK_ENABLED`, `DB_PATH`, `LOG_LEVEL`, `API_TIMEOUT` - 未使用的环境配置

**🟡 中优先级优化**

- **修复重复定义**:
  - 统一请求超时配置，删除 `API_LIMITS.REQUEST_TIMEOUT_MS` 重复
- **配置简化**:
  - 保留核心环境变量：`NODE_ENV`, `PORT`, `DB_PATH`

**✅ 验证结果**

- **代码质量**: `bun run lint` 0 warnings, 0 errors
- **构建成功**: `bun run build` 正常完成
- **功能完整**: 所有核心功能保持正常
- **Bundle优化**: 减少约 2KB 未使用代码

**📊 清理统计**

- **删除文件**: 1个完全未使用的文件
- **删除代码行数**: ~50行冗余代码
- **删除常量**: 5个未使用的配置项
- **优化文件**: 3个配置文件精简

### 2026-02-08 - i18n 类型安全重构与移动端优化

**🟡 类型安全重构**

- **i18next 官方模式**:
  - 采用官方类型安全模式（`as const` + `CustomTypeOptions`）
  - 删除手动类型定义文件 `src/i18n/types.ts`
  - 删除不必要的 barrel export `src/i18n/locales/index.ts`
  - 创建 `src/i18n/i18next.d.ts` 使用官方扩展模式
  - 在翻译文件中添加 `import "i18next"` 确保类型推断

- **错误处理优化**:
  - 修复 errorHandler.ts 模板字符串类型错误
  - 使用类型安全的 switch 语句替代动态键合成
  - 添加缺失的错误类型翻译：`common.errors.types.{validation|calculation|network|system}`
  - 在 `zh-CN.ts` 和 `en-US.ts` 中统一错误前缀模式

**🟢 移动端体验提升**

- **历史记录 Drawer**:
  - 移动端从 100% 调整为 85% 避免全屏遮挡
  - 所有表单组件支持响应式尺寸
  - 卡片、输入框、选择器等根据 `isMobile` 动态调整尺寸
  - 减少内边距、间距和字体大小

- **PC 布局扩展**:
  - 内容区域宽度从 `max-w-7xl` (1280px) 扩展至 1600px
  - 提供更多内容展示空间

- **组件响应式优化**:
  - ThemeToggle, LanguageSelector: `isMobile ? "small" : "large"`
  - ChartTypeSelector: `isMobile ? "small" : "middle"`
  - 所有表单和结果组件传递 `isMobile` prop

**🔧 技术改进**

- **废弃 API 迁移**:
  - MainLayout Drawer: `width={280}` → `size="default"`
  - 验证所有 `Space direction` 已替换为 `Flex vertical`
  - 验证所有 `Statistic valueStyle` 已替换为 `styles.content`
  - 验证所有 `Alert message` 已替换为 `title`

- **性能优化**:
  - BasicChart: 添加 `debounce={1}` 优化性能
  - 图表容器使用 `minHeight` 防止零高度警告
  - 使用 `Form.useWatch` 监听表单值避免警告

- **代码清理**:
  - FooterContent: 删除未使用的 `Space` 导入

**✅ 验证结果**

- **代码质量**: `bun run lint` 0 warnings, 0 errors
- **构建成功**: `bun run build` 编译成功
- **功能完整**: 所有核心功能保持正常
- **测试覆盖**: 86 个测试全部通过
- **类型安全**: IDE 可提供完整的翻译键自动补全

**📊 重构统计**

- **删除文件**: 2个未使用/冗余文件
- **新增文件**: 1个类型声明文件
- **修改文件**: 15+ 组件和配置文件
- **类型改进**: i18next 从手动类型推断升级为官方类型安全模式
- **移动端优化**: 适配更小的屏幕尺寸

## 🎨 Ant Design 主题配置最佳实践

### 主题配置原则

- **统一主色**: 在 `src/theme/index.tsx` 中配置 `colorPrimary: "#667eea"`，确保全站颜色一致
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

- [x] 无废弃 API 使用（查看浏览器控制台警告）
- [x] `Space direction` 已替换为 `Flex vertical`
- [x] `Statistic valueStyle` 已替换为 `styles.content`
- [x] `Alert message` 已替换为 `title`
- [x] 使用 `Form.useWatch` 而非 `form.getFieldValue`

### 国际化检查

- [x] 无硬编码中文或英文文本
- [x] 所有文本使用 `t()` 函数引用
- [x] 翻译键已添加到 `zh-CN.ts` 和 `en-US.ts`
- [x] 变量插值使用 `t("key", { variable: value })`
- [x] 修复滑动条刻度国际化
- [x] 修复历史抽屉标题响应式设计

### 性能检查

- [x] 内联样式提取为常量（Slider、Card 等）
- [x] useCallback 依赖数组完整且正确
- [x] useMemo 用于昂贵的计算
- [x] 防抖/节流功能正常工作

### 健壮性检查

- [x] 边界参数处理（分页、输入验证）
- [x] 错误处理完善（try-catch + ErrorHandler）
- [x] 类型安全（无 any，使用 unknown + 类型守卫）
- [x] Decimal.js 用于所有金融计算

## 🚀 提交流程与检查清单

### 提交前必做流程

#### 1. 代码质量检查

**Lint 检查（类型感知）**

```bash
bun run lint
```

- ✅ 必须通过：0 warnings, 0 errors
- 📊 规则生效：105条规则检查

**TypeScript 类型检查**

```bash
bun run typecheck
```

- ✅ 必须通过：无类型错误

#### 2. 测试验证

**运行所有测试**

```bash
bun test
```

- ✅ 必须通过：所有测试用例

**测试覆盖率（可选）**

```bash
bun test:coverage
```

- 📊 确保核心逻辑有测试覆盖

#### 3. 代码格式化

**自动格式化**

```bash
bun run format
```

- ✅ 使用 oxfmt 格式化所有代码

**格式检查**

```bash
bun run format:check
```

- ✅ 确保代码格式一致

#### 4. 构建验证

**生产构建**

```bash
bun run build
```

- ✅ 必须成功：构建无错误
- 📦 检查 bundle 大小是否合理

#### 5. 文档更新（如需要）

**README.md 更新**

- [ ] 如果有新功能，更新功能特性列表
- [ ] 如果修复了重要问题，添加到更新日志
- [ ] 如果有 API 变更，更新使用说明

**AGENTS.md 更新**

- [ ] 如果有新的约束或规范，添加到关键约束
- [ ] 如果有新组件或架构变更，更新项目结构
- [ ] 如果有新的最佳实践，添加代码审查清单

**i18n 翻译更新**

- [ ] 如果添加了新的 UI 文本，添加到 zh-CN.ts 和 en-US.ts
- [ ] 如果修改了类型定义，更新 types.ts
- [ ] 运行应用验证中英文切换正常

### 提交流程

#### 提交前检查清单

```bash
# 完整检查流程
bun run lint         # Lint 检查
bun run typecheck    # 类型检查
bun test            # 测试验证
bun run format      # 代码格式化
bun run build       # 构建验证

# 查看 git 状态
git status
```

#### 提交规范

**1. 查看变更内容**

```bash
git diff                    # 查看未暂存的变更
git diff --staged          # 查看已暂存的变更
```

**2. 添加文件到暂存区**

```bash
git add <file>             # 添加单个文件
git add .                  # 添加所有变更
git add src/              # 添加 src 目录下所有变更
```

**3. 创建提交**

**提交信息格式**：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：

- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 重构（不是新功能也不是修复）
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `test`: 测试相关（添加/修改测试）
- `chore`: 构建过程或辅助工具变动
- `perf`: 性能优化
- `build`: 构建系统或依赖项变动

**示例**：

```bash
git commit -m "feat(oxlint): 完善类型感知检查配置

- 添加 --type-aware 标志启用 TypeScript 类型检查
- 配置 categories 批量管理规则，减少配置复杂度
- 修复 InputNumber parser/fomatter 类型问题

验证:
- ✅ bun run lint: 0 warnings, 0 errors
- ✅ bun run typecheck: 通过
- ✅ bun test: 22/22 通过
"
```

**4. 推送远程**

```bash
git push origin main           # 推送到 main 分支
git push origin feature/xxx   # 推送到功能分支
```

### 提交后验证

#### 远程构建检查（如果有 CI/CD）

- [ ] CI 检查通过
- [ ] 部署成功（如果有）

#### 功能验证

- [ ] 在开发环境验证功能正常
- [ ] 在生产环境验证功能正常（如果是小版本）
- [ ] 浏览器测试（Chrome, Firefox, Safari）
- [ ] 移动端测试（iOS/Android）

### 常见问题处理

#### Lint 不通过怎么办？

**查看错误信息**

```bash
bun run lint
```

**自动修复**

```bash
bun run lint:fix
```

**手动修复特殊规则**

- `// oxlint-disable-next-line` - 禁单行规则
- `// oxlint-disable-line` - 禁当前行规则
- `/* oxlint-disable */` ... `/* oxlint-enable */` - 禁代码块规则

#### 类型错误怎么办？

**查看错误详情**

```bash
bun run typecheck
```

**常见修复方法**

1. 添加明确的类型注解
2. 使用类型守卫（`isSomething` 函数）
3. 使用可选链 `?.` 和空值合并 `??`
4. 避免使用 `any`，使用 `unknown` + 类型守卫

#### 测试失败怎么办？

**运行单个测试**

```bash
bun test -t "测试名称"
```

**运行单个文件**

```bash
bun test path/to/test.ts
```

**调试模式**

```bash
bun test --watch
```

### 提交流程总结

**提交流程图**：

```
1. 开发完成
   ↓
2. bun run lint ✅
   ↓
3. bun run typecheck ✅
   ↓
4. bun test ✅
   ↓
5. bun run format
   ↓
6. 更新文档（如需要）
   ↓
7. git add .
   ↓
8. git commit -m "..."
   ↓
9. git push
   ↓
10. 验证功能
```

**必做项**：

- ✅ Lint 检查通过
- ✅ 类型检查通过
- ✅ 测试全部通过
- ✅ 代码已格式化
- ✅ 构建成功
- ✅ 文档已更新（如需要）
