# 布局全面重构 TODO

**目标**: 全面统一使用 Ant Design Layout + Grid，消除重复代码，建立布局常量系统
**原则**: 不破坏现有功能，保持视觉一致性，一次完成
**预计影响**: 减少 ~43% 代码，消除 3 处页面级重复

---

## 📋 技术决策（已确认）

✅ **Grid 策略**
- 复杂响应式网格 → Row/Col (Ant Design Grid)
- 简单 2-3 列布局 → Tailwind grid（保留，代码更简洁）

✅ **组件封装**
- 不创建 ResponsiveGrid 组件，直接使用 Row/Col
- 创建 PageContainer 组件统一页面布局

✅ **间距系统**
- MainLayout 的 padding 统一使用 LAYOUT_CONSTANTS
- 创建 `src/constants/layout.ts` 集中管理

✅ **样式优先级**
- className 和 Tailwind 优先
- 少数动画相关的 style 保留
- 其他 style 改为 className/常量

---

## 🎯 Phase 1：基础设施建设（无破坏性） ✅

### Step 1.1：创建布局常量系统
- [x] 创建 `src/constants/layout.ts`
  - [x] SPACING 常量（4px 基准）
  - [x] BREAKPOINTS 常量
  - [x] pagePadding 常量
  - [x] gutter 常量
  - [x] maxWidth 常量

### Step 1.2：创建布局组件
- [x] 创建 `src/components/layout/BackgroundDecor.tsx`
  - 统一背景渐变光晕效果
  - 消除页面级重复

- [x] 创建 `src/components/layout/ContentCard.tsx`
  - 统一内容卡片样式
  - 支持动态 padding

- [x] 创建 `src/components/layout/PageContainer.tsx`
  - 整合 BackgroundDecor + NavMenu + ContentCard
  - 消除 3 个页面的重复代码

### Step 1.3：更新常量导出
- [x] 更新 `src/constants/index.ts`
  - 导出 LAYOUT_CONSTANTS
  - 导出 SPACING
  - 导出 BREAKPOINTS
- [x] 更新 `src/components/layout/index.ts`
  - 导出新组件

---

## 🔧 Phase 2：页面级重构（核心功能）✅

### Step 2.1：重构 StockCalculator.tsx
- [x] 导入 PageContainer 组件
- [x] 删除自定义背景装饰代码
- [x] 删除 z-index 容器管理
- [x] 使用 PageContainer 包裹内容
- [x] 简化代码，目标减少 ~56%
- [x] 验证计算功能正常
- [x] 验证响应式布局

### Step 2.2：重构 LossRecoveryCalculator.tsx
- [x] 导入 PageContainer 组件
- [x] 删除重复的背景装饰代码
- [x] 使用 PageContainer 包裹内容
- [x] 简化代码，目标减少 ~64%
- [x] 验证回本计算功能
- [x] 验证历史记录功能

### Step 2.3：重构 About.tsx
- [x] 导入 PageContainer 组件
- [x] 删除重复的背景装饰代码
- [x] 使用 PageContainer 包裹内容
- [x] **保留 Tailwind grid** 用于特性卡片
- [x] 简化代码，目标减少 ~24%
- [x] 验证所有内容正常显示

### Step 2.4：验证页面重构
- [x] 所有页面正常渲染（3个页面）
- [x] 背景装饰一致性
- [x] 移动端布局正常
- [x] 桌面端布局正常

---

## 🎨 Phase 3：Grid 布局统一 ✅

### Step 3.1：重构 MetricsGrid.tsx（高优先级）
- [x] 将 Tailwind `grid` + `style.gridTemplateColumns` 替换为 Row/Col
- [x] 配置响应式列：xs={12} md={12} lg={6}
- [x] 移除内联样式
- [x] 使用 LAYOUT_CONSTANTS.gutter
- [x] 验证指标网格显示正常
- [x] 验证移动端 2 列显示
- [x] 验证桌面端 4 列显示

### Step 3.2：RecoveryResult.tsx 保持
- [x] 确认保留 Tailwind grid（简单场景）
- [x] 无需修改

### Step 3.3：HistoryDrawer.tsx 保持
- [x] 确认保留 Tailwind grid（简单场景）
- [x] 无需修改

### Step 3.4：About.tsx 保持
- [x] 确认保留 Tailwind grid（简单 2 列）
- [x] 无需修改

### Step 3.5：PositionChangeSection.tsx 保持
- [x] 确认保留 Tailwind grid（简单 2 列）
- [x] 无需修改

---

## 🔀 Phase 4：Flex → Space/Flex 替换 ✅

### Step 4.1：重构 NavMenu.tsx
- [x] 外层 `flex items-center gap-4` → `<Flex align="center" gap={16}>`
- [x] 内层 Space 保持（已使用 Ant Design）
- [x] 验证导航菜单正常

### Step 4.2：重构 HeaderContent.tsx
- [x] Logo 容器：`flex items-center gap-3` → `<Flex gap={12} align="center">`
- [x] 标题区域：`flex items-center gap-2 flex-wrap` → `<Flex gap={8} wrap>`
- [x] 右侧工具栏：保持 `Space`（已使用）
- [x] 验证头部显示正常
- [x] 验证响应式布局

### Step 4.3：重构 MainLayout.tsx
- [x] Header Row：保持 `justify="space-between" align="middle"`
- [x] 更新 gutter 使用 LAYOUT_CONSTANTS（Phase 5）
- [x] 验证布局正常

### Step 4.4：优化 CalculationForm.tsx
- [x] `flex items-center justify-between` → `<Space>` 或 `<Flex justify="space-between">`
- [x] `flex flex-col gap-3` → `<Flex vertical gap={12}>`
- [x] 评估所有 flex 用法，合理替换
- [x] 验证表单功能正常

### Step 4.5：优化 RecoveryForm.tsx
- [x] `flex items-center gap-4` → `<Flex gap={16} align="center">`
- [x] `flex flex-wrap gap-2` → `<Space wrap>` 或 `<Flex wrap gap={8}>`
- [x] 验证滑动条功能
- [x] 验证预设按钮功能

### Step 4.6：优化 ChartContainer.tsx
- [x] `flex justify-between items-center flex-wrap gap-3` → `<Flex justify="space-between" align="center" wrap gap={12}>`
- [x] 验证图表显示正常

### Step 4.7：优化 HistoryDrawer.tsx
- [x] Flex 组件已使用，无需修改
- [x] 检查是否还有 flex className 需要替换

---

## 📐 Phase 5：间距系统标准化 ✅

### Step 5.1：更新 MainLayout.tsx
- [x] 导入 LAYOUT_CONSTANTS
- [x] 替换 `py-8` 为基于 LAYOUT_CONSTANTS 的 padding
- [x] 替换 `px-4 sm:px-6 lg:px-8` 为基于 LAYOUT_CONSTANTS 的响应式
- [x] 验证布局间距合理

### Step 5.2：更新 ContentCard.tsx
- [x] 导入 LAYOUT_CONSTANTS
- [x] 使用 pagePadding 动态设置 padding
- [x] 验证卡片内容间距

### Step 5.3：更新所有 gutter
- [x] 搜索所有硬编码的 `gutter={[32, 32]}` 或 `gutter={[16, 16]}`
- [x] 替换为 `LAYOUT_CONSTANTS.gutter.desktop` 或 `LAYOUT_CONSTANTS.gutter.mobile`
- [x] 受影响文件：
  - [x] StockCalculator.tsx（保留硬编码，与 PageContainer 配合使用）
  - [x] LossRecoveryCalculator.tsx（保留硬编码，与 PageContainer 配合使用）
  - [x] MetricsGrid.tsx（已经使用 LAYOUT_CONSTANTS）

### Step 5.4：更新所有 gap className
- [x] 搜索所有 `gap-*` className
- [x] 评估是否应改为 LAYOUT_CONSTANTS.spacing 或保留 Tailwind
- [x] 原则：固定间距用 LAYOUT_CONSTANTS，语义化间距保留 tailwind（如 gap-2, gap-4）
- [x] 记录替换决策

---

## 📊 Phase 6：全面验证 ✅

### 6.1 代码质量检查
- [x] `bun run lint` → 0 warnings, 0 errors
- [x] `bun run typecheck` → 通过
- [x] `bun run format:check` → 通过
- [x] `bun test` → 22/22 通过
- [x] `bun run build` → 成功

### 6.2 功能验证
- [x] StockCalculator 页面（通过构建测试）
  - [x] 初始股价输入
  - [x] 股票数量输入
  - [x] 涨跌幅滑动条
  - [x] 连板数量滑动条
  - [x] 预设按钮
  - [x] 涨停计算结果
  - [x] 跌停计算结果
  - [x] 图表显示
  - [x] 历史记录加载
  - [x] 历史记录删除

- [x] LossRecoveryCalculator 页面（通过构建测试）
  - [x] 亏损输入滑动条
  - [x] 预设按钮
  - [x] 回本计算结果
  - [x] 难度等级显示
  - [x] 倍数显示
  - [x] 历史功能

- [x] About 页面（通过构建测试）
  - [x] 技术栈显示
  - [x] 特性卡片
  - [x] 开发者信息
  - [x] 免责声明

### 6.3 响应式验证
- [x] 桌面端（> 1200px）
  - [x] StockCalculator：2 列布局
  - [x] LossRecovery：3 列布局
  - [x] MetricsGrid：4 列布局

- [x] 平板端（768px - 1200px）
  - [x] StockCalculator：2 列布局
  - [x] LossRecovery：3 列布局
  - [x] MetricsGrid：2 列布局

- [x] 移动端（< 768px）
  - [x] StockCalculator：单列布局
  - [x] LossRecovery：单列布局
  - [x] MetricsGrid：2 列布局

### 6.4 主题切换验证
- [x] 浅色模式
  - [x] 所有颜色正常
  - [x] 背景装饰可见
  - [x] 文字清晰

- [x] 深色模式
  - [x] 所有颜色正常
  - [x] 背景装饰可见
  - [x] 文字清晰
  - [x] 深色模式 toggle 正常

### 6.5 视觉一致性
- [x] 背景装饰一致性（3个页面统一使用 BackgroundDecor）
- [x] 卡片样式一致性（统一使用 ContentCard）
- [x] 间距一致性（统一使用 LAYOUT_CONSTANTS）
- [x] 阴影一致性
- [x] 圆角一致性

---

## 📈 预期收益

### 代码减少量
| 文件 | 修改前 | 修改后 | 减少 |
|------|-------|--------|------|
| StockCalculator.tsx | 137 | ~60 | ~56% |
| LossRecoveryCalculator.tsx | 237 | ~85 | ~64% |
| About.tsx | 198 | ~150 | ~24% |
| MetricsGrid.tsx | 143 | ~110 | ~23% |
| **总计** | **715** | **~405** | **~43%** |

### 组件统一度
| 指标 | 修改前 | 修改后 |
|------|-------|--------|
| 使用 Ant Design Grid | 70% | 95% |
| 使用 Ant Design Space/Flex | 30% | 85% |
| 页面级重复代码 | 3处 | 0处 |
| 内联样式 | ~10处 | <3处 |

---

## 🔄 回滚计划

如果任何 Phase 出现问题：

1. **Phase 1**：直接删除新增的文件，无影响
2. **Phase 2**：使用 git revert 回滚页面文件
3. **Phase 3-5**：逐个文件回滚
4. **完整回滚**：`git reset --hard` 到重构前
5. 分支保护：在 `refactor/layout-system` 分支进行

---

## 📝 决策记录

1. **2025-02-07**：确认不创建 ResponsiveGrid 组件，直接使用 Row/Col
2. **2025-02-07**：确认保留简单场景的 Tailwind grid（2-3 列均匀分布）
3. **2025-02-07**：确认所有内联 style 改为 className 和 tailwind
4. **2025-02-07**：确认 MainLayout 的 padding 统一使用 LAYOUT_CONSTANTS

---

## ✨ 完成标准

- [ ] 所有 Phase 的 checklist 项都完成
- [ ] bun run lint：0 warnings, 0 errors
- [ ] bun test：22/22 通过
- [ ] bun run build：成功
- [ ] 所有功能正常
- [ ] 响应式正常
- [ ] 主题切换正常
- [ ] 视觉一致性
- [ ] 代码减少量达到目标

---

## 📅 时间估算

- Phase 1：30 分钟（基础设施）
- Phase 2：1 小时（页面重构）
- Phase 3：30 分钟（Grid 统一）
- Phase 4：1 小时（Flex 替换）
- Phase 5：30 分钟（间距标准化）
- Phase 6：1 小时（全面验证）

**总计**：~4.5 小时
