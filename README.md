# 股票计算器

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178c6.svg)](https://www.typescriptlang.org)
[![Vite+](https://img.shields.io/badge/Vite%2B-0.3-f472b6.svg)](https://viteplus.dev)
[![Deploy](https://github.com/crper/stock-compound-calc/actions/workflows/deploy.yml/badge.svg)](https://github.com/crper/stock-compound-calc/actions/workflows/deploy.yml)

基于 React 19 + Vite+ + TypeScript 的股票投资计算工具集，包含连板收益计算器和亏损回本计算器，支持高精度计算、历史记录管理和数据可视化。已优化移动端体验，支持手机浏览器直接访问，可平滑移植到小程序。

**在线体验**：<https://crper.github.io/stock-compound-calc/>

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
- **数据可视化**：多种图表类型展示（柱状图、曲线图，双Y轴图），深色模式自适应
- **实时响应**：参数变化自动触发计算
- **历史记录**：保存和查询历史计算记录
- **红涨绿跌**：涨跌配色遵循 A 股惯例（涨=红、跌=绿），结果区与历史区语义统一

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
- **统一视觉 Token**：品牌色（indigo→violet）经 Tailwind `@theme` 单一数据源管理（`brand`/`brand-deep`/`brand-border`/`brand-soft`），组件不再散落品牌色 hex
- **清爽卡片布局**：内容卡片直接上浮于品牌氛围光（aurora）背景之上，去除「卡套卡」嵌套，留白更激进、层级更扁平

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

- **Node.js 22+** - JavaScript 运行时（生产预览由 `vp preview` 提供）
- **Zod 4.4.3** - Schema 验证
- **Decimal.js 10.6.0** - 高精度计算
- **es-toolkit 1.51.0** - 现代工具库

### 开发工具

- **Vite+ 0.3.0** - 统一工具链（构建、测试、Lint、格式化）
- **TypeScript 7.0.2** - 类型安全（tsc 原生 Go 版）
- **oxlint / oxfmt** - 代码检查与格式化（由 Vite+ 内置提供）

## 快速开始

> 依赖安装与脚本执行统一由 Vite+（`vp`）驱动，底层包管理器为 npm（锁文件 `package-lock.json`）。所有 `npm run xxx` 命令均可等价换成 `vp run xxx` / 直接使用 `vp` 子命令。

### 安装依赖

```bash
vp install
```

### 开发模式

启动开发服务器（端口 3000，支持 HMR）：

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 生产运行

构建并本地预览：

```bash
npm run start
```

## 开发指南

### 代码规范

#### 类型检查与代码质量

TypeScript 类型检查：

```bash
npm run typecheck
```

运行 lint 检查（类型感知）：

```bash
npm run lint
```

自动修复 lint 问题：

```bash
npm run lint:fix
```

格式化代码：

```bash
npm run format
```

检查格式：

```bash
npm run format:check
```

### 测试

运行所有测试：

```bash
npm run test
```

运行特定测试：

```bash
npm run test -- -t "测试名称"
```

监听模式：

```bash
npm run test:watch
```

覆盖率报告：

```bash
npm run test:coverage
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
├── services/        # 业务服务层（计算 + 持久化编排，无 HTTP 语义）
│   ├── calculationService.ts # 计算与存储编排
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
  id: crypto.randomUUID(),
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

- Node.js ^20.19 || ^22.18 || >=24.11（Vite+ 运行时要求）
- npm（随 Node.js 自带；`vp install` 会自动检测并使用）

### 本地部署

1. 安装依赖

```bash
vp install
```

2. 构建

```bash
npm run build
```

3. 运行（本地预览）

```bash
npm run start
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
2. 通过 `voidzero-dev/setup-vp` 安装 Vite+（Node 24），再 `vp install --no-frozen-lockfile --ignore-scripts` 安装依赖
   （CI 不使用 `--frozen-lockfile`：`vite-plus` 通过 8 个平台 `optionalDependencies` 分发 native binding，
   跨平台 lockfile 锁定当前 OS 的 tarball，CI 直接 install 仍会缺失当前平台 binding。
   加 `--ignore-scripts` 是为了跳过 `prepare: vp config` 钩子：钩子会在 binding 装齐前触发 vp 子命令，
   加载项目 node_modules/vite-plus/binding 失败、进而中断 install 本身。）
3. 格式检查（`vp run format:check`）
4. oxlint 类型感知代码检查（`vp run lint`）
5. TypeScript 类型检查（`vp run typecheck`）
6. i18n 翻译键一致性检查（`vp run check:i18n`）
7. 单元测试（`vp test run`）
8. 生产构建（`vp run build`）
9. 添加 `.nojekyll` 禁用 Jekyll 处理
10. 通过 `actions/deploy-pages` 发布到 Pages

**为什么用 HashRouter：** 单页应用部署在 GitHub Pages 的子路径下时，BrowserRouter 会因刷新导致 404；HashRouter 将路径放在 `#/` 之后，无需服务端路由重写，对 Pages 完全友好。

**资源路径：** `index.html` 中所有 CSS/JS/图片都使用相对路径（`./chunk-...`），与部署子路径无关，仓库名变动也无需重新构建。

## 工具链说明（Vite+）

项目已迁移到 [Vite+](https://viteplus.dev)，构建、测试、Lint、格式化统一由 `vp` 驱动。
所有工具配置集中在 `vite.config.ts` 的对应配置块（`lint` / `fmt` / `test` / `staged`），
不再需要独立的 `oxlint.json`、`vitest.config.ts` 等文件。

### 常用命令

| 命令                                                   | 说明                                                    |
| ------------------------------------------------------ | ------------------------------------------------------- |
| `vp install`                                           | 安装依赖（自动检测 npm 引擎，锁文件 package-lock.json） |
| `npm run dev` / `vp dev`                               | 启动开发服务器（端口 3000）                             |
| `npm run build` / `vp build`                           | 生产构建                                                |
| `npm test` / `vp test run`                             | 运行测试                                                |
| `npm run lint` / `vp lint --type-aware src`            | 类型感知 Lint                                           |
| `npm run format` / `vp fmt src scripts vite.config.ts` | 格式化                                                  |
| `vp check`                                             | 一次跑完 Lint + 格式检查 + 类型检查（提交前推荐）       |

### Lint 配置要点

- **类型感知**：开启 `typeAware` 与 `typeCheck`，可捕获 `no-unsafe-*` 等类型问题
- **批量规则**：用 `categories` 继承规则集，再在 `rules` 中按需覆盖
- **三方插件**：`unicorn`、`typescript`、`oxc`、`react`、`jsx-a11y`、`promise`
- **已关闭的高噪声纯风格规则**：`no-magic-numbers`、`no-ternary`、`jsx-max-depth`、`sort-keys` 等；
  另外 `unicorn/filename-case` 与本项目 PascalCase 组件命名约定冲突，
  `react/react-in-jsx-scope` 在项目使用自动 JSX runtime 时属于误报，均已关闭

### 代码分割

首屏只加载连板计算器，图表（Recharts）与「关于」「亏损回本」页面按需懒加载，
首屏 JS 体积相比单包方案减少约 48%。

更多详情见 [AGENTS.md](./AGENTS.md)。
