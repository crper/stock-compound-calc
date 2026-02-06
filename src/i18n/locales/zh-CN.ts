import type { TranslationResources } from "../types";

export const zhCN: { translation: TranslationResources } = {
  translation: {
    common: {
      navigation: {
        stockCalculator: "股价连板计算器",
        lossRecovery: "亏损回本计算器",
        about: "关于",
      },
      buttons: {
        history: "历史记录",
        batchDelete: "批量删除",
        cancelSelection: "取消选择",
        clearHistory: "清空历史",
        confirm: "确认",
        cancel: "取消",
        close: "关闭",
        delete: "删除",
      },
      footer: {
        copyright: "©2026 股价收益计算器",
        disclaimer: "仅供参考，不构成投资建议",
      },
      tags: {
        realTime: "实时计算",
        history: "历史记录",
        visualization: "数据可视化",
        limitUp: "涨停",
        limitDown: "跌停",
        recoveryAnalysis: "回本分析",
        quickLookup: "1-100%速查",
        riskAssessment: "风险评估",
      },
      tooltips: {
        themeToggle: {
          light: "切换到亮色模式",
          dark: "切换到暗色模式",
        },
        languageToggle: "切换语言",
        historyButton: "查看历史记录",
      },
      empty: {
        noHistory: "暂无历史记录",
        noResults: "暂无结果",
        noData: "暂无数据",
      },
    },
    stockCalculator: {
      title: "股价收益计算器",
      subtitle: "智能分析连板收益，实时计算投资回报",
      description: "支持涨停/跌停双向计算",
      form: {
        title: "计算参数",
        initialPrice: "初始股价",
        stockQuantity: "股票数量",
        dailyReturn: "涨跌幅度",
        boardCount: "连板数量",
        units: {
          yuan: "元",
          shares: "股",
          percent: "%",
          days: "天",
        },
        placeholders: {
          initialPrice: "请输入初始股价",
          stockQuantity: "选填，默认为100股",
        },
        tooltips: {
          initialPrice: "请输入股票的起始价格，最大支持10亿",
          stockQuantity: "请输入持有的股票数量，选填",
        },
        sliderDescriptions: {
          dailyReturn: "拖动滑块设置每日涨跌幅百分比，范围1%-30%",
          boardCount: "拖动滑块设置连续涨停/跌停天数，范围1-15天",
        },
        presets: {
          label: "快速设置：",
          mainBoard: "A股主板",
          starMarket: "科创板",
          bex: "北交所",
        },
        initialMarketValue: "初始持仓市值",
      },
      results: {
        empty: {
          title: "输入参数后自动显示计算结果",
          subtitle: "调整表单中的参数开始计算",
        },
        overview: {
          consecutiveUp: "连续涨停",
          consecutiveDown: "连续跌停",
          days: "天",
          finalPrice: "最终股价",
        },
        metrics: {
          doubleDays: "翻倍天数",
          breakEvenReturn: "盈亏回撤",
          tenXDays: "10倍天数",
          annualizedReturn: "年化收益",
          title: "关键指标",
          tooltip: "关键指标帮助您快速评估投资潜力和风险",
          dynamicTooltip: "以 {{return}}% 涨跌幅，需要 {{days}} 天{{action}}",
        },
        positionChange: {
          title: "持仓变化",
          shares: "股",
          initialMarketValue: "初始市值",
          finalMarketValue: "最终市值",
          profitLoss: "持仓盈亏",
        },
        priceChange: {
          title: "股价变化",
          initial: "初始",
          final: "最终",
        },
      },
      history: {
        title: "计算历史",
        recordCount: "{{count}} 条记录",
        selectedCount: "已选 {{count}} 项",
        searchPlaceholder: "搜索初始股价",
        dateRange: {
          start: "开始日期",
          end: "结束日期",
        },
        filterReturn: "涨跌幅",
        filterAll: "全部",
        selectAll: "全选 ({{count}} 条)",
        confirmDelete: "确认删除",
        confirmDeleteDesc: "确定要删除选中的 {{count}} 条记录吗？",
        confirmClear: "确认清空",
        confirmClearDesc: "确定要清空所有历史记录吗？此操作不可恢复。",
        noMatch: "未找到匹配的记录",
        initialParams: "初始参数",
        boardDays: "天",
        holding: "持仓 {{count}} 股",
        limitUpProfit: "涨停收益",
        limitDownLoss: "跌停收益",
      },
      charts: {
        title: "数据可视化",
        loading: "正在加载图表...",
        noData: "暂无图表数据",
        error: {
          title: "数据加载失败",
          message: "无法加载图表数据，请检查输入参数",
        },
        types: {
          bar: "柱状图",
          line: "曲线图",
        },
      },
      errors: {
        inputError: "输入错误",
      },
    },
    recoveryCalculator: {
      title: "亏损回本计算器",
      subtitle: "智能计算回本所需涨幅，提供完整速查表",
      description: "计算亏损后回本所需的涨幅",
      form: {
        title: "亏损百分比",
        currentLoss: "当前亏损",
        unit: "%",
        sliderDescription: "拖动滑块设置亏损百分比，范围 0% - 99.9%",
        presets: {
          label: "快速选择：",
        },
      },
      results: {
        title: "回本分析",
        difficulty: {
          label: "回本难度",
        },
        currentLoss: "当前亏损",
        requiredGain: "需要上涨",
        multiplier: "回本倍数",
        multiplierDesc: "当前市值需上涨此倍数才能回本",
        warnings: {
          highRisk: {
            title: "高风险提醒",
            desc: "当亏损超过50%时，回本难度将大幅增加",
          },
          severe: {
            title: "严重警告",
            desc: "亏损超过80%后，回本几乎不可能，建议及时止损",
          },
        },
        difficultyLevels: {
          noLoss: "无需回本",
          easy: "容易",
          medium: "中等",
          hard: "困难",
          veryHard: "非常难",
          almostImpossible: "几乎不可能",
        },
      },
      table: {
        title: "速查表",
        range: "1% - 100%",
        columns: {
          loss: "亏损",
          required: "需涨",
          multiplier: "倍数",
        },
        formula: "公式：需涨幅% = 亏损% ÷ (100 - 亏损%) × 100",
      },
    },
    about: {
      title: "关于",
      subtitle: "关于本应用",
      description: "一款专业的股票收益计算工具，帮助投资者快速计算连板收益、回本涨幅等关键指标。",
      techStack: {
        title: "技术栈",
        frontend: "前端框架",
        backend: "后端/构建",
        database: "数据存储",
        tools: "工具库",
        list: {
          bun: "Bun - 现代 JavaScript 运行时与构建工具",
          react: "React 19 - 最新版 React 框架",
          typescript: "TypeScript - 类型安全的 JavaScript 超集",
          antd: "Ant Design v6 - 企业级 UI 组件库",
          tailwind: "Tailwind CSS v4 - 原子化 CSS 框架",
          indexeddb: "IndexedDB - 浏览器本地数据库",
          dexie: "Dexie - IndexedDB 的优雅封装",
          reactRouter: "React Router v7 - 路由管理",
          recharts: "Recharts - 数据可视化图表库",
          decimal: "Decimal.js - 高精度数值计算",
          zod: "Zod - TypeScript 优先的验证库",
          i18next: "i18next - 国际化框架",
        },
      },
      features: {
        title: "核心功能",
        stock: {
          title: "股价连板计算器",
          desc: "计算连续涨停/跌停后的收益情况，支持正向和负向计算",
        },
        recovery: {
          title: "亏损回本计算器",
          desc: "计算亏损后回本所需的涨幅，提供1-100%完整速查表",
        },
        visualization: {
          title: "数据可视化",
          desc: "使用图表直观展示收益趋势，支持柱状图和曲线图",
        },
        history: {
          title: "历史记录",
          desc: "本地存储计算历史，支持搜索、筛选和批量管理",
        },
      },
      developer: {
        title: "开发者",
        description: "本应用由 crper 开发维护",
        github: "GitHub",
      },
      disclaimer: {
        title: "免责声明",
        content: "本应用仅供学习和参考使用，计算结果不构成任何投资建议。股市有风险，投资需谨慎。",
      },
    },
    validation: {
      price: {
        min: "股价必须大于0.01元",
        max: "股价必须小于10亿",
      },
      boardCount: {
        integer: "连板数量必须为整数",
        min: "连板数量至少为1天",
        max: "连板数量最多为3650天",
      },
      dailyReturn: {
        min: "涨跌幅不能小于-99%",
        max: "涨跌幅不能大于100%",
      },
      stockQuantity: {
        integer: "股票数量必须为整数",
        min: "股票数量至少为1股",
        max: "股票数量最多为100亿股",
      },
      priceZero: "涨跌幅不能导致股价为零或负数",
      atLeastOneRecord: "至少选择一条记录",
    },
  },
};
