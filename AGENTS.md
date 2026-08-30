# AGENTS.md - AI 编码指南

**项目:** 股票计算器 (Vite+ + React 19 + TypeScript + IndexedDB/Dexie + React Router + Tailwind v4 + Ant Design v6 + i18next)
**最后更新:** 2026-08-30

## 核心命令

> 构建 / 测试 / Lint / 格式化统一由 Vite+ (`vp`) 驱动，配置集中在 `vite.config.ts` 的 `lint` / `fmt` / `test` / `staged` 块，不要新建独立的 oxlint/vitest 配置文件。
> 依赖安装与脚本执行经 npm（锁文件 `package-lock.json`）：`npm run xxx` 等价于 `vp run xxx`，也可直接用 `vp` 子命令。

```bash
vp install               # 安装依赖（自动检测 npm 引擎，锁文件 package-lock.json）
npm run dev              # 开发服务器 (端口 3000)，或 vp dev
npm run build            # 生产构建，或 vp build
npm run lint             # oxlint 类型感知检查 (必须通过，0 errors，不新增 warnings)
npm run lint:fix         # 自动修复 lint 问题
npm run format           # oxfmt 格式化
npm run format:check     # 检查格式
npm run typecheck        # tsc --noEmit 类型检查
npm run check:i18n       # 校验 i18n 翻译键完整性
vp check                 # Lint + 格式 + 类型一次跑完（vp CLI 子命令，提交前推荐）
npm run test             # 运行所有测试
npm run test:watch       # 监听模式
npm run test:coverage    # 覆盖率报告
```

## 项目结构

```
src/
├── components/      # UI 组件 (charts/displays/forms/layout/navigation/shared)
├── db/              # IndexedDB 数据层 (Dexie + Repository 模式)
├── hooks/           # 自定义 Hooks (useResponsive, useStockCalculator 等)
├── i18n/            # 国际化 (index.ts + i18next.d.ts + locales/zh-CN.ts, en-US.ts)
├── services/        # 业务服务层（计算 + 持久化编排，无 HTTP 语义）
├── utils/           # 工具函数 (errorHandler, formatters 等)
├── constants/       # 常量 (UI_CONSTANTS、CALCULATION_LIMITS、TREND_COLORS 等)
├── schemas/         # Zod schemas
├── types/           # TypeScript 类型
├── pages/           # 页面组件
├── theme/           # 主题配置
├── App.tsx          # 根组件
└── main.tsx         # 应用入口
```

## 代码风格

### 导入

- 使用 `@/` 别名引用内部路径
- 分组顺序：外部库 → 内部模块 → 类型导入，组间空行

### 命名

- 组件/类型/接口: PascalCase；函数/变量: camelCase；常量: UPPER_SNAKE_CASE
- 布尔变量用 `is/has/can` 前缀；自定义 Hook 以 `use` 开头

### TypeScript

- 严格模式，禁止 `any`，必要时用 `unknown` + 类型守卫
- 类型优先从 Zod schemas 推断：`type T = z.infer<typeof Schema>`
- 优先可选链 `?.` 和空值合并 `??`，避免类型断言

### React

- 仅函数组件，禁止默认导出（用 `export const Foo = ...`）
- UI 组件用 `React.memo` 包裹，Props 在函数签名处解构
- 大计算用 `useMemo`，稳定回调用 `useCallback`，useEffect 依赖必须完整
- 路由用 HashRouter（GitHub Pages 子路径友好）

### 错误处理

统一使用 `@/utils/errorHandler` 的 `AppError` / `ErrorHandler`，catch 块必须包装未知错误；Zod 验证失败重新抛出为 AppError。

### 高精度计算

所有股票价格/收益率计算**必须用 Decimal.js**（全局精度配置在应用入口 `main.tsx` 统一设置），禁止用 JavaScript Number 做金融计算；Decimal → Number 需经 `.toString()` 中转。

## 响应式与视觉

- `useResponsive()` 提供 mobile (<768px) / tablet (768–1199px) / desktop (≥1200px) 三档，断点订阅委托 antd `Grid.useBreakpoint()`（基于 matchMedia），不要改回 resize 监听
- 断点含义交由 antd 定义：`md: 768` / `xl: 1200` 对应三档上/下界，栅格用 `Row`/`Col` 的 `xs`/`md`/`lg` 对应三档，不再维护独立断点常量
- 导航：桌面/平板用 `NavigationMenu`，手机端用底部 `MobileTabBar`
- 新增响应式样式必须同时给出 `dark:` 变体，保持深色/浅色模式兼容
- 重型依赖（页面、Recharts 图表）用 `React.lazy` + `Suspense` 懒加载
- 纯图标按钮补 `aria-label`，切换类按钮补 `aria-pressed`
- **涨跌配色统一为红涨绿跌（A 股惯例）**：一律消费 `src/constants/colors.ts` 的 `TREND_COLORS`，禁止在组件里硬编码涨跌色串
- **品牌主色（indigo→violet）统一消费 `src/index.css` 的 `@theme` brand token**：Tailwind 类用 `brand`/`brand-deep`/`brand-border`/`brand-soft`（如 `bg-brand`、`text-brand-soft`、`from-brand to-brand-deep`），内联样式用 `var(--color-brand*)`。组件内禁止直接写品牌色 hex（`#667eea`/`#764ba2` 等）；antd seed 色 `colorPrimary` 与 `index.html` 的 `theme-color` 因需具体色值做派生/不支持变量，仅这两处保留字面量

## i18n 规范

- 所有 UI 文本走 `react-i18next`，禁止硬编码中英文；翻译键加到 `src/i18n/locales/` 的 `zh-CN.ts` 和 `en-US.ts`（均用 `as const`）
- 类型安全用官方模式：`src/i18n/i18next.d.ts` 扩展 `CustomTypeOptions`，翻译键有 IDE 自动补全
- 语言检测：浏览器 `zh*` → 中文，否则英文；兜底英文；偏好持久化到 localStorage（键 `app-language`）
- 新增/修改翻译后运行 `npm run check:i18n` 校验

## Ant Design 要点

- 主题统一在 `src/theme/index.tsx` 的 ConfigProvider 配置（`colorPrimary: #667eea`），不要用 CSS 覆盖组件样式
- 避免废弃 API：`Space direction="vertical"` → `Flex vertical`；`Statistic valueStyle` → `styles.content`；**新增 `Alert` 一律用 `title=`（禁 `message=`）**；`Slider` 的 `trackStyle/handleStyle` → `styles` 对象
- 渲染期间读取表单值用 `Form.useWatch`，不要调 `form.getFieldValue()`（会触发 useForm 警告）
- **表单数据流单一化**：`Form.Item` 的子元素必须直接接受 antd 注入的 `value/onChange`（不要在中间包一层 `<div>` 导致注入断链）；禁止在子组件 `onChange` 里手动 `setFieldsValue` + 二次调用 `onValuesChange`。位于 `Form.Item` 之外的控件（如预设按钮）是唯一例外：先 `form.setFieldsValue`，再用 `form.getFieldsValue()` 触发一次

## 关键约束

- ❌ 默认导出、类组件、`any` 类型、硬编码 UI 文本、废弃 AntD API
- ❌ 金融计算用 Number（必须 Decimal.js）、硬编码魔法数字（常量放 `src/constants`）
- ❌ **不引入 axios / react-query**：全应用无任何 HTTP 请求（纯本地计算 + IndexedDB），`useLiveQuery` 已是 IndexedDB 版的 react-query；未来接入行情 API 时再一并引入 axios + @tanstack/react-query
- ✅ 数据访问用 Dexie + Repository 模式，响应式查询用 `useLiveQuery`（不用 React Query）
- ✅ service 层只做「计算 + 持久化」编排，不做响应包装（无 `ApiResponse` 假网络层）；计算/存储层抛出的 AppError 原样透传
- ✅ 异步操作（删除/清空历史等）的错误处理收敛在 hook 内（toast + 日志），UI 组件 await 成功后才提示成功
- ✅ 数值边界（股价/连板数/涨跌幅/股数）统一引用 `CALCULATION_LIMITS`；Zod schema 引用它作为唯一约束来源，validator 与表单均从 schema 派生，不再各自内联边界
- ✅ 防抖统一用 es-toolkit `debounce`（与 useStockCalculator 一致），ID 统一用 `crypto.randomUUID()`（见 `utils/idGenerator`，含 legacy fallback）
- ✅ API/用户输入用 Zod schema 验证
- ✅ 修改现有文件前先读取内容；提交前必须通过 lint + test
- ✅ 逻辑变更需更新/添加对应 `__tests__` 测试

## 提交前检查

1. `npm run lint` — 0 errors，不新增 warnings
2. `npm run typecheck` — 无类型错误
3. `npm run test` — 全部通过
4. `npm run format` — 已格式化
5. `npm run build` — 构建成功

提交信息格式：`<type>(<scope>): <subject>`，type 取 feat / fix / refactor / docs / style / test / chore / perf / build。
