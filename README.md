# 股票计算器

基于 React 19 + Bun + TypeScript 的股票投资计算工具集，包含连板收益计算器和亏损回本计算器，支持高精度计算、历史记录管理和数据可视化。

## 功能特性

### 📈 股价连板计算器
- **双向计算**：同时计算涨停和跌停的收益情况
- **高精度计算**：使用 Decimal.js 确保计算精度
- **年化收益率**：计算投资的复合年增长率（CAGR）以评估长期表现
- **数据可视化**：多种图表类型展示（柱状图、曲线图、双Y轴图）
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

- **React 19.2.3** - UI 框架
- **React Router 7.13.0** - 路由管理
- **Ant Design 6.2.0** - UI 组件库
- **Tailwind CSS 4.1.18** - 样式方案
- **React Query 5.90.17** - 状态管理和数据获取
- **Recharts 3.6.0** - 数据可视化
- **Day.js 1.11.19** - 日期处理

### 后端

- **Bun 1.3.8** - JavaScript 运行时和服务器
- **SQLite (bun:sqlite)** - 嵌入式数据库
- **Zod 4.3.6** - Schema 验证
- **Decimal.js 10.6.0** - 高精度计算
- **es-toolkit 1.44.0** - 现代工具库

### 开发工具

- **TypeScript** - 类型安全
- **oxlint** - 快速代码检查（类型感知）
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

运行 lint 检查：

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
├── client/              # React 前端
│   ├── components/      # UI 组件
│   │   ├── charts/      # 图表组件
│   │   ├── displays/    # 展示组件
│   │   ├── forms/       # 表单组件
│   │   ├── navigation/  # 导航组件
│   │   └── shared/      # 共享组件
│   ├── hooks/           # 自定义 Hooks
│   │   ├── useLossRecovery.ts    # 亏损回本计算
│   │   └── useStockCalculator.ts # 连板收益计算
│   ├── services/        # 业务服务层
│   ├── pages/           # 页面组件
│   │   ├── StockCalculator.tsx      # 连板计算器页面
│   │   └── LossRecoveryCalculator.tsx # 回本计算器页面
│   ├── theme/           # 主题配置
│   └── App.tsx          # 根组件
├── server/              # Bun 后端
│   ├── __tests__/       # 后端测试文件
│   ├── database.ts      # 数据库操作
│   ├── calculations.ts  # API 路由
│   ├── stockCalculator.ts # 计算逻辑
│   └── index.ts         # 服务器入口
└── shared/              # 前后端共享
    ├── constants/       # 常量定义
    ├── schemas/         # Zod schemas
    ├── types/           # TypeScript 类型
    └── utils/           # 工具函数
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
import { CalculationParamsSchema } from "@/shared/schemas";

const result = CalculationParamsSchema.safeParse(input);
```

### API 接口

#### GET /api/calculations

获取历史记录，支持分页参数 (`?page=1&limit=50`)

#### POST /api/calculations

创建新的计算记录并保存到历史

- Body: `{ initialPrice, boardCount, dailyReturn }`

#### POST /api/calculations/calculate

仅执行计算，不保存到历史记录

- Body: `{ initialPrice, boardCount, dailyReturn }`
- Response: `{ up: CalculationResult, down: CalculationResult }`

#### DELETE /api/calculations

清除所有历史记录

#### PATCH /api/calculations

批量删除历史记录

- Body: `{ ids: string[] }`

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
NODE_ENV=production bun start
```

### 环境变量

当前版本使用默认配置，未来版本将支持以下环境变量：

```bash
PORT=3000
NODE_ENV=production
DB_PATH=./calculations.db
LOG_LEVEL=info
```

## 更新日志

### 2025-02-04

#### 代码优化与质量改进

**性能优化**
- 提取内联样式为常量，减少渲染时对象创建
- 修复 `useCallback` 依赖问题，防抖功能正常工作
- 优化 React Query 缓存策略

**Bug 修复**
- 修复 Ant Design 废弃 API 警告：
  - `Space direction` → `Flex vertical`
  - `Statistic valueStyle` → `Statistic styles.content`
  - `Alert message` → `Alert title`
- 修复 `useForm` 未连接警告：使用 `Form.useWatch` 替代直接调用 `form.getFieldValue`
- 添加分页参数边界处理，防止 `NaN` 导致的异常

**代码质量**
- 简化类型导出，使用通配符导出避免重复定义
- 完善错误处理边界
- 提升测试覆盖率

## 开发贡献

欢迎提交 Issue 和 Pull Request！

提交前请确保：

1. `bun run lint` 通过
2. `bun test` 全部通过
3. `bun run format` 格式化代码

## 许可证

MIT
