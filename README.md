# 股票计算器

基于 React 19 + Bun + TypeScript 的股票投资计算工具集，包含连板收益计算器和亏损回本计算器，支持高精度计算、历史记录管理和数据可视化。

## 功能特性

### 🌍 多语言支持

- **中文/英文切换**：支持简体中文和英文界面
- **自动检测**：根据浏览器语言自动选择（`zh*` 开头→中文，其他→英文）
- **持久化记忆**：语言偏好保存在 localStorage

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

- **路由导航**：使用 React Router 实现多页面切换
- **深色模式**：支持主题切换
- **响应式设计**：适配手机和桌面端
- **历史管理**：支持查看、加载、删除历史记录

## 技术栈

### 前端

- **React 19.2.4** - UI 框架
- **React Router 7.13.0** - 路由管理
- **Ant Design 6.2.3** - UI 组件库
- **Tailwind CSS 4.1.18** - 样式方案
- **Dexie.js 4.3.0** - IndexedDB 客户端
- **Dexie React Hooks 4.2.0** - 响应式数据查询
- **Recharts 3.7.0** - 数据可视化
- **Day.js 1.11.19** - 日期处理
- **react-i18next 16.5.4** - 国际化框架
- **i18next 25.8.4** - 国际化核心
- **i18next-browser-languagedetector 8.2.0** - 浏览器语言检测

### 后端（简化）

- **Bun 1.3.8** - JavaScript 运行时和静态文件服务器
- **Zod 4.3.6** - Schema 验证
- **Decimal.js 10.6.0** - 高精度计算
- **es-toolkit 1.44.0** - 现代工具库

### 开发工具

- **TypeScript** - 类型安全
- **oxlint** - 快速代码检查（类型感知，支持100+ ESLint规则）
- **oxfmt** - 代码格式化

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
│   ├── navigation/  # 导航组件
│   │   ├── NavMenu.tsx          # 导航菜单
│   │   └── LanguageSelector.tsx # 语言切换
│   └── shared/      # 共享组件
├── db/              # IndexedDB 数据库层 (Dexie)
│   ├── dexie.ts                    # 数据库配置
│   ├── calculationRepository.ts     # 数据访问层
│   └── __tests__/                  # 数据库测试
├── hooks/           # 自定义 Hooks
│   ├── useLossRecovery.ts    # 亏损回本计算
│   └── useStockCalculator.ts # 连板收益计算
├── i18n/            # 国际化配置
│   ├── index.ts                # i18n 初始化
│   ├── types.ts                # 类型定义
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
├── App.tsx          # 根组件
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

## 部署

### 环境要求

- Bun >= 1.3.4
- Node.js >= 18（如使用 polyfill）

### 部署步骤

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

### 环境变量

```bash
PORT=3000
NODE_ENV=production
```

### 数据存储

所有数据存储在浏览器的 IndexedDB 中，无需服务器端数据库。历史记录在客户端本地持久化。

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
