# 股票计算器

基于 React 19 + Bun + TypeScript 的股票投资计算工具集，包含连板收益计算器和亏损回本计算器，支持高精度计算、历史记录管理和数据可视化。已优化移动端体验，支持手机浏览器直接访问，可平滑移植到小程序。

## 功能特性

### 🌍 多语言支持

- **中文/英文切换**：支持简体中文和英文界面
- **自动检测**：根据浏览器语言自动选择（`zh*` 开头→中文，其他→英文）
- **持久化记忆**：语言偏好保存在 localStorage

### 📱 移动端优先体验

- **小程序风格底部 TabBar**：固定底部 3 标签栏（连板计算 / 亏损回本 / 关于），active 态着色
- **安全区适配**：完整支持 iPhone 底部安全区（`env(safe-area-inset-bottom)`）
- **紧凑头部**：移动端头部高度 56px，含主题切换与语言切换快捷按钮
- **触控优化**：禁用双击缩放（`touch-action: manipulation`），保留捏合缩放；48px 最小触控目标
- **响应式布局**：桌面端水平导航菜单 + 两列内容；移动端底部 TabBar + 单列卡片

### 📈 股价连板计算器

- **双向计算**：同时计算涨停和跌停的收益情况
- **高精度计算**：使用 Decimal.js 确保计算精度
- **年化收益率**：计算投资的复合年增长率（CAGR）以评估长期表现
- **数据可视化**：多种图表类型展示（柱状图、曲线图，双Y轴图）
- **实时响应**：参数变化自动触发计算
- **历史记录**：保存和查询历史计算记录

### 📉 亏损回本计算器

- **回本计算**：输入亏损百分比，自动计算回本所需涨幅
- **回本倍数**：显示当前市值需上涨倍数才能回本
- **速查表**：1%-100% 完整回本数据速查表
- **风险评估**：根据亏损程度智能评估回本难度
- **防抖优化**：用户停止操作后才保存历史记录

### 🎨 通用特性

- **路由导航**：使用 HashRouter 实现多页面切换（GitHub Pages 子路径友好）
- **深色模式**：支持主题切换
- **响应式设计**：适配手机和桌面端
- **历史管理**：支持查看、加载、删除历史记录
- **类型安全国际化**：使用 i18next 官方类型安全模式，提供完整的 IDE 自动补全

## 技术栈

### 前端

- **React 19.2.8** - UI 框架
- **React Router 7.18.2** - 路由管理（HashRouter，GitHub Pages 友好）
- **Ant Design 6.6.1** - UI 组件库
- **Tailwind CSS 4.3.3** - 样式方案
- **Dexie.js 4.4.5** - IndexedDB 客户端
- **Dexie React Hooks 4.4.0** - 响应式数据查询
- **Recharts 3.10.1** - 数据可视化
- **Day.js 1.11.23** - 日期处理
- **react-i18next 17.0.12** - 国际化框架
- **i18next 26.4.0** - 国际化核心
- **i18next-browser-languagedetector 8.2.1** - 浏览器语言检测

### 后端（简化）

- **Bun 1.4.0** - JavaScript 运行时、构建工具与静态文件服务器
- **Zod 4.4.3** - Schema 验证
- **Decimal.js 10.6.0** - 高精度计算
- **es-toolkit 1.51.0** - 现代工具库

### 开发工具

- **TypeScript 7.0.2** - 类型安全（tsc 原生 Go 版）
- **oxlint 1.79.0** - 快速代码检查（类型感知，支持100+ ESLint规则）
- **oxfmt 0.64.0** - 代码格式化

## 快速开始

### 安装依赖

```bash
bun install
```

### 开发模式

启动开发服务器（端口 3000，支持 HMR）：

```bash
bun dev
```

### 生产构建

```bash
bun run build
```

### 生产运行

```bash
bun start
```

## 开发指南

### 代码规范

#### 类型检查与代码质量

TypeScript 类型检查：

```bash
bun run typecheck
```

运行 lint 检查（类型感知）：

```bash
bun run lint
```

自动修复 lint 问题：

```bash
bun run lint:fix
```

格式化代码：

```bash
bun run format
```

检查格式：

```bash
bun run format:check
```

### 测试

运行所有测试：

```bash
bun test
```

运行特定测试：

```bash
bun test -t "测试名称"
```

监听模式：

```bash
bun test --watch
```

### 项目结构

```
src/
├── components/      # UI 组件
│   ├── charts/      # 图表组件
│   ├── displays/    # 展示组件
│   ├── forms/       # 表单组件
│   ├── layout/      # 布局（Header/Footer/TabBar/Navigation 等）
│   │   ├── MobileTabBar.tsx    # 移动端底部导航（小程序风格）
│   │   ├── NavigationMenu.tsx  # 桌面端水平导航
│   │   └── MainLayout.tsx      # 响应式主布局
│   ├── navigation/  # 导航控件（LanguageSelector）
│   └── shared/      # 共享组件
├── db/              # IndexedDB 数据库层 (Dexie)
│   ├── dexie.ts                    # 数据库配置
│   ├── calculationRepository.ts     # 数据访问层
│   └── __tests__/                  # 数据库测试
├── hooks/           # 自定义 Hooks
│   ├── useLossRecovery.ts    # 亏损回本计算
│   ├── useStockCalculator.ts # 连板收益计算
│   └── useResponsive.ts      # 响应式断点（移动端/桌面端判断）
├── i18n/            # 国际化配置
│   ├── index.ts                # i18n 初始化
│   ├── i18next.d.ts            # 类型声明
│   └── locales/                # 翻译文件
│       ├── zh-CN.ts            # 简体中文
│       └── en-US.ts            # 英文
├── services/        # 业务服务层
│   ├── calculationService.ts # 计算服务
│   └── __tests__/            # 服务测试
├── utils/           # 工具函数
│   ├── stockCalculator.ts    # 连板计算逻辑
│   ├── lossRecovery.ts       # 亏损回本计算
│   ├── formatters.ts         # 数据格式化
│   ├── idGenerator.ts        # ID 生成工具
│   └── errorHandler.ts       # 错误处理
├── constants/       # 常量定义
├── schemas/         # Zod schemas
├── types/           # TypeScript 类型
├── pages/           # 页面组件
│   ├── StockCalculator.tsx      # 连板计算器页面
│   ├── LossRecoveryCalculator.tsx # 回本计算器页面
│   └── About.tsx                # 关于页面
├── theme/           # 主题配置
├── App.tsx          # 根组件（HashRouter 适配 GitHub Pages）
└── main.tsx         # 应用入口
```

## 核心特性说明

### 高精度计算

使用 Decimal.js 进行所有价格计算，避免 JavaScript 浮点数精度问题：

```typescript
import Decimal from "decimal.js";

const result = new Decimal(initialPrice).mul(new Decimal(1).plus(dailyReturn.div(100)));
```

### 类型安全

前后端共享 TypeScript 类型定义，通过 Zod schema 进行运行时验证：

```typescript
import { CalculationParamsSchema } from "@/schemas";

const result = CalculationParamsSchema.safeParse(input);
```

### 本地数据存储

使用 IndexedDB (Dexie.js) 进行本地数据持久化：

```typescript
import { db } from "@/db/dexie";

await db.calculations.put({
  id: Date.now().toString(),
  timestamp: Date.now(),
  initialPrice: params.initialPrice,
  // ...
});
```

### 响应式数据查询

使用 Dexie React Hooks 实现自动数据更新：

```typescript
import { useLiveQuery } from "dexie-react-hooks";

const history = useLiveQuery(() => calculationRepository.getAll({ limit: 50 }), []);
```

### 国际化类型安全

使用 i18next 官方类型安全模式，提供完整的键值自动补全：

```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

// IDE 可提供完整的键值自动补全
const title = t("stockCalculator.form.title");
const price = t("stockCalculator.form.initialPrice");

// 变量插值
const message = t("stockCalculator.results.finalPrice.value", { value: 100 });
```

类型声明文件 (`i18n/i18next.d.ts`) 使用官方标准模式：

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

## 部署

### 环境要求

- Bun >= 1.4.0
- Node.js >= 18（如使用 polyfill）

### 本地部署

1. 安装依赖

```bash
bun install
```

2. 构建

```bash
bun run build
```

3. 运行

```bash
bun start
```

服务默认监听 `http://localhost:3000`。

### 环境变量

```bash
PORT=3000
NODE_ENV=production
```

### 数据存储

所有数据存储在浏览器的 IndexedDB 中，无需服务器端数据库。历史记录在客户端本地持久化。

### GitHub Pages 部署

项目内置 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 工作流，推送到 `main` 分支即自动构建并部署到 GitHub Pages。

**首次启用步骤：**

1. 进入 GitHub 仓库的 **Settings → Pages**
2. 在 **Source** 处选择 **GitHub Actions**
3. 推送代码到 `main` 分支（或手动触发 workflow_dispatch）
4. 部署完成后访问 `https://<username>.github.io/<repo>/`

**工作流执行步骤：**

1. Checkout 代码
2. 安装 Bun 与依赖
3. i18n 翻译键一致性检查
4. oxlint 类型感知代码检查
5. TypeScript 类型检查
6. Bun 单元测试
7. 生产构建（Bun bundler）
8. 添加 `.nojekyll` 禁用 Jekyll 处理
9. 通过 `actions/deploy-pages` 发布到 Pages

**为什么用 HashRouter：** 单页应用部署在 GitHub Pages 的子路径下时，BrowserRouter 会因刷新导致 404；HashRouter 将路径放在 `#/` 之后，无需服务端路由重写，对 Pages 完全友好。

**资源路径：** `index.html` 中所有 CSS/JS/图片都使用相对路径（`./chunk-...`），与部署子路径无关，仓库名变动也无需重新构建。

## Oxlint 配置说明

项目使用 oxlint 进行代码检查，配置文件为 `oxlint.json`。

### 核心特性

- **类型感知**: 通过 `--type-aware` 标志启用 TypeScript 类型检查
- **批量规则**: 使用 categories 隐式继承数百条规则，无需逐条声明
- **三方插件集成**: 支持 React、TypeScript、Unicorn、Promise 等插件
- **导入排序**: 实验性导入排序功能自动组织 import 语句

### 配置结构

```json
{
  "plugins": ["unicorn", "typescript", "oxc", "react", "jsx-a11y", "promise", "react-hooks"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "style": "warn",
    "restriction": "off",
    "perf": "off",
    "nursery": "warn"
  },
  "rules": {
    "typescript/no-explicit-any": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error"
  }
}
```

### 规则分类

- **correctness**: 代码错误或无用代码
- **suspicious**: 可能有问题或无用的代码
- **style**: 风格一致性规则
- **restriction**: 禁止特定模式或功能
- **perf**: 性能优化规则
- **nursery**: 开发中的实验性规则

更多详情见 [AGENTS.md](./AGENTS.md)。

## 更新日志

### 2026-08-24

**依赖全面更新（依赖最新稳定版）**

- antd 6.3.0 → 6.6.1
- @ant-design/icons 6.1.0 → 6.3.2
- react 19.2.4 → 19.2.8
- react-dom 19.2.4 → 19.2.8
- react-router-dom 7.13.0 → 7.18.2
- i18next 25.8.6 → 26.4.0（主版本）
- react-i18next 16.5.4 → 17.0.12（主版本）
- i18next-browser-languagedetector 8.2.0 → 8.2.1
- dexie 4.3.0 → 4.4.5
- dexie-react-hooks 4.2.0 → 4.4.0
- es-toolkit 1.44.0 → 1.51.0
- dayjs 1.11.19 → 1.11.23
- recharts 3.7.0 → 3.10.1
- tailwindcss 4.1.18 → 4.3.3
- zod 4.3.6 → 4.4.3
- @types/react 19.2.14 → 19.2.18
- @types/react-dom 19.2.3 → 19.2.4
- @types/bun latest → 1.4.0
- oxlint 1.47.0 → 1.79.0
- oxlint-tsgolint 0.11.5 → 7.0.2001
- oxfmt 0.28.0 → 0.64.0
- **TypeScript 5.9.3 → 7.0.2**（升级到原生 Go 版 tsc）

**TypeScript 7 适配**

- `bun-env.d.ts` 新增 `declare module "*.css"`（TS7 严格化 side-effect CSS 导入类型检查）
- `HistoryDrawer.tsx` 修复 `count: number | undefined` 类型错误（`?? 0` 兜底）

**代码清理与质量提升**

- 删除冗余文件：`package-lock.json`（项目用 bun）、`calculations.db`（SQLite 残留）、`todo.md`（空文件）、`scripts/test-all.sh`（含硬编码假统计）、`scripts/e2e-test.sh`（依赖 agent-browser 环境的本地脚本）
- 删除整目录 `src/config/`（含服务端 env 残留、DB_PATH、未生效的 decimal 精度配置）
- 删除已废弃组件：`src/components/navigation/NavMenu.tsx`（旧导航）、`src/components/layout/MobileNavigation.tsx`（被 NavigationMenu 抽屉模式替代）
- 删除死常量：`API_LIMITS`、`SPACING`/`BREAKPOINTS` 快捷导出、`DECIMAL_CONFIG`（从未生效）、`UI_CONSTANTS.RESPONSIVE_BREAKPOINT`（被硬编码）
- 删除死 schema：`BatchDeleteSchema`/`BatchDeleteRequest`
- 清理 `components/index.ts` 死导出（LanguageSelector、ResultOverviewCard、BasicChart、ChartTypeSelector 等）
- 简化 `NavigationMenu.tsx`：删除已无消费者的 `isDrawer` 抽屉分支
- `useResponsive` 默认值改用 `UI_CONSTANTS.RESPONSIVE_BREAKPOINT` 替代硬编码 768
- 优化 import 排序与死代码

**移动端体验优化（为移植小程序做准备）**

- 新增 `MobileTabBar` 组件：小程序风格固定底部 TabBar，3 标签（连板计算 / 亏损回本 / 关于），active 态用主色着色，含 `aria-current` 无障碍属性
- `MainLayout` 重构：
  - 桌面端保留水平导航菜单
  - 移动端使用底部 TabBar，移除汉堡菜单+Drawer
  - 移动端头部右侧新增主题切换 + 语言切换快捷按钮（紧凑 40×40）
  - 移动端头部高度 64px → 56px
- 安全区适配：`env(safe-area-inset-bottom)` 应用于 TabBar 高度、HistoryFloatButton bottom 偏移、Footer padding
- `index.html` viewport 加 `viewport-fit=cover`（iPhone 全面屏）、新增 `theme-color`/`description`/`apple-mobile-web-app-capable` meta
- `index.css` 全局：`touch-action: manipulation`（禁用双击缩放、保留捏合）、`-webkit-tap-highlight-color: transparent`、字体抗锯齿
- `HistoryFloatButton` 移动端 bottom 自动避开 TabBar
- 所有资源使用相对路径（`./...`），便于 GitHub Pages 子路径部署

**GitHub Pages 自动部署**

- 新增 `.github/workflows/deploy.yml`：push 到 main / workflow_dispatch 触发
- 步骤：install → i18n 检查 → lint → typecheck → test → build → 上传 dist → deploy-pages
- 缓存 Bun 安装以加速
- 写入 `dist/.nojekyll` 禁用 Jekyll 处理

**质量验证**

- oxlint 类型感知：0 warnings, 0 errors（66 文件，111 规则）
- TypeScript 7.0.2 类型检查：通过
- 单元测试：86 / 86 通过（5 个文件）
- i18n 翻译键：193 个中英文一致
- 生产构建：成功，dist 产物 2.21 MB JS + 54 KB CSS

### 2026-02-12

**依赖更新**

- antd 6.2.3 → 6.3.0
- i18next 25.8.4 → 25.8.6
- oxlint 1.43.0 → 1.47.0
- oxlint-tsgolint 0.11.4 → 0.11.5
- @types/react 19.2.10 → 19.2.14
- @types/bun 更新到最新

**类型安全优化**

- 定义 `ValidationKey` 联合类型，实现验证键的类型安全
- 移除 `as never` 类型断言，使用规范类型推断
- 删除废弃的 `getFieldErrorMessage` 函数
- 修复 package.json 中 typecheck 命令（`bun run tsc` → `bunx tsc`）
- 添加缺失的翻译键：`common.tags.lossRecovery`、`stockCalculator.results.metrics.tooltip`

### 2026-02-08

**i18n 类型安全重构**

- 采用 i18next 官方类型安全模式，使用 `as const` 和 `CustomTypeOptions`
- 实现完整的翻译键 IDE 自动补全支持
- 添加错误类型翻译：`common.errors.types.{validation|calculation|network|system}`
- 优化错误处理逻辑，使用类型安全的 switch 语句替代模板字符串

**移动端优化**

- 历史记录 Drawer 移动端尺寸调整为 85%，避免全屏遮挡
- 表单组件支持响应式尺寸（Input、Select、DatePicker）
- PC 端布局宽度从 1280px 扩展至 1600px

**技术改进**

- 清理未使用的导入（FooterContent 中的 Space）
- 使用 `Form.useWatch` 替代 `form.getFieldValue` 避免警告
- 图表容器添加防抖机制 (debounce=1)
- Drawer size 属性废弃 API 迁移完成

**代码质量**

- oxlint 类型感知检查：0 warnings, 0 errors
- 测试覆盖率：86 个测试全部通过
- 生产构建成功，bundle 大小优化
