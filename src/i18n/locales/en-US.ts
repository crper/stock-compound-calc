import "i18next";

export const enUS = {
  translation: {
    common: {
      navigation: {
        stockCalculator: "Stock Calculator",
        lossRecovery: "Loss Recovery",
        about: "About",
        menuTitle: "Navigation Menu",
      },
      buttons: {
        history: "History",
        batchDelete: "Batch Delete",
        cancelSelection: "Cancel Selection",
        clearHistory: "Clear History",
        confirm: "Confirm",
        cancel: "Cancel",
        close: "Close",
        delete: "Delete",
        collapseLess: "Collapse",
        expandMore: "Expand",
        retry: "Retry",
      },
      languages: {
        chinese: "中文",
        english: "English",
      },
      footer: {
        copyright: "©2026 Stock Calculator",
        disclaimer: "For reference only, not investment advice",
      },
      tags: {
        history: "History",
        recoveryAnalysis: "Recovery Analysis",
        info: "About Page",
        limitUp: "Limit Up Calc",
      },
      tooltips: {
        languageToggle: "Switch language",
        historyButton: "View history",
        themeToggle: {
          light: "Light theme",
          dark: "Dark theme",
        },
      },
      empty: {
        noHistory: "No history records",
        noData: "No data available",
      },
      messages: {
        selectFirst: "Please select records to delete first",
        deleteSuccess: "Deleted {{count}} records",
        deleteFailed: "Delete failed, please try again later",
        clearSuccess: "History cleared successfully",
        clearFailed: "Failed to clear history",
      },
      errorBoundary: {
        title: "Application Error",
        description: "Sorry, the application encountered an unexpected error.",
        details: "Error details (click to expand)",
        tryAgain: "Try Again",
      },
      errors: {
        types: {
          validation: "Validation Error",
          calculation: "Calculation Error",
          network: "Network Error",
          system: "System Error",
        },
      },
    },
    stockCalculator: {
      form: {
        title: "Calculation Parameters",
        initialPrice: "Initial Price",
        stockQuantity: "Stock Quantity",
        dailyReturn: "Daily Return",
        boardCount: "Board Count",
        units: {
          yuan: "CNY",
          shares: "shares",
          days: "days",
          percent: "%",
        },
        placeholders: {
          initialPrice: "Enter initial stock price",
          stockQuantity: "Enter the number of shares held (optional)",
        },
        tooltips: {
          initialPrice: "Enter the starting price of the stock, max 1 billion",
          stockQuantity: "Enter the number of shares held, optional",
        },
        sliderDescriptions: {
          dailyReturn: "Drag slider to set daily return percentage, range 1%-30%",
          boardCount: "Drag slider to set consecutive days, range 1-15 days",
        },
        presets: {
          label: "Quick settings: ",
          mainBoard: "A-Share Main Board",
          starMarket: "STAR Market",
          bex: "BSE",
        },
        initialMarketValue: "Initial Market Value",
      },
      results: {
        empty: {
          title: "Results will display automatically after input",
          subtitle: "Adjust parameters in the form to start calculation",
        },
        overview: {
          consecutiveUp: "Consecutive Limit Up",
          consecutiveDown: "Consecutive Limit Down",
          days: "days",
        },
        metrics: {
          doubleDays: "Double Days",
          breakEvenReturn: "Break-even Return",
          tenXDays: "10x Days",
          annualizedReturn: "Annualized Return",
          title: "Key Metrics",
          dynamicTooltip: "With {{return}}% daily return, need {{days}} days to double",
          breakEvenTooltip: "Need {{return}}% reverse movement to return to initial price",
          tenXTooltip: "With {{return}}% daily return, need {{days}} days to reach 10x",
          annualizedTooltip: "Annualized return calculated based on {{days}} days",
        },
        positionChange: {
          title: "Position Change",
          shares: "shares",
          initialMarketValue: "Initial Value",
          finalMarketValue: "Final Value",
          profitLoss: "Profit/Loss",
        },
        priceChange: {
          title: "Price Change",
          initial: "Initial",
          final: "Final",
        },
        finalPrice: {
          label: "Final Price",
        },
      },
      history: {
        title: "Calculation History",
        recordCount: "{{count}} records",
        selectedCount: "{{count}} selected",
        searchPlaceholder: "Search initial price",
        dateRange: {
          start: "Start date",
          end: "End date",
        },
        filterReturn: "Return Rate",
        filterAll: "All",
        selectAll: "Select All ({{count}})",
        confirmDelete: "Confirm Delete",
        confirmDeleteDesc: "Are you sure you want to delete {{count}} selected records?",
        confirmClear: "Confirm Clear",
        confirmClearDesc: "Are you sure you want to clear all history? This cannot be undone.",
        noMatch: "No matching records found",
        holding: "Holding {{count}} shares",
        limitUpProfit: "Limit Up Profit",
        limitDownLoss: "Limit Down Loss",
      },
      charts: {
        title: "Data Visualization",
        loading: "Loading chart...",
        noData: "No chart data available",
        error: {
          title: "Data Load Failed",
          message: "Unable to load chart data, please check input parameters",
        },
        types: {
          bar: "Bar Chart",
          line: "Line Chart",
        },
        limitUp: "Limit Up",
        limitDown: "Limit Down",
      },
      errors: {
        inputError: "Input Error",
      },
    },
    recoveryCalculator: {
      title: "Loss Recovery Calculator",
      form: {
        title: "Loss Percentage",
        currentLoss: "Current Loss",
        unit: "%",
        sliderDescription: "Drag slider to set loss percentage, range 0% - 99.9%",
        presets: {
          label: "Quick select: ",
        },
      },
      results: {
        title: "Recovery Analysis",
        difficulty: {
          label: "Recovery Difficulty",
        },
        difficultyLevels: {
          noLoss: "No Loss",
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          veryHard: "Very Hard",
          almostImpossible: "Almost Impossible",
        },
        currentLoss: "Current Loss",
        requiredGain: "Required Gain",
        multiplier: "Multiplier",
        multiplierDesc: "Current market value needs to increase by this multiplier to recover",
        warnings: {
          highRisk: {
            title: "High Risk Warning",
            desc: "When loss exceeds 50%, recovery difficulty increases significantly",
          },
          severe: {
            title: "Severe Warning",
            desc: "After loss exceeds 80%, recovery is almost impossible, consider cutting losses",
          },
        },
      },
      table: {
        title: "Quick Lookup",
        range: "1% - 100%",
        columns: {
          loss: "Loss",
          required: "Required",
          multiplier: "Multiple",
        },
        formula: "Formula: Required% = Loss% ÷ (100 - Loss%) × 100",
      },
      history: {
        title: "Recovery History",
      },
    },
    about: {
      description:
        "A professional stock return calculator that helps investors quickly calculate key metrics like consecutive limit returns and recovery gains.",
      techStack: {
        title: "Tech Stack",
        frontend: "Frontend",
        backend: "Backend/Build",
        database: "Database",
        tools: "Tools",
        list: {
          bun: "Bun - Modern JavaScript runtime and build tool",
          react: "React 19 - Latest version of React framework",
          typescript: "TypeScript - Type-safe JavaScript superset",
          antd: "Ant Design v6 - Enterprise UI component library",
          tailwind: "Tailwind CSS v4 - Atomic CSS framework",
          indexeddb: "IndexedDB - Browser local database",
          dexie: "Dexie - Elegant IndexedDB wrapper",
          reactRouter: "React Router v7 - Route management",
          recharts: "Recharts - Data visualization chart library",
          decimal: "Decimal.js - High-precision numerical calculation",
          zod: "Zod - TypeScript-first validation library",
          i18next: "i18next - Internationalization framework",
        },
      },
      features: {
        title: "Core Features",
        stock: {
          title: "Stock Limit Calculator",
          desc: "Calculate returns after consecutive limit up/down, supporting both directions",
        },
        recovery: {
          title: "Loss Recovery Calculator",
          desc: "Calculate required gain to recover from losses, with complete 1-100% lookup table",
        },
        visualization: {
          title: "Data Visualization",
          desc: "Visualize return trends with charts, supporting bar and line charts",
        },
        history: {
          title: "History Records",
          desc: "Local storage of calculation history with search, filter and batch management",
        },
      },
      developer: {
        title: "Developer",
        description: "This app is developed and maintained by crper",
        github: "GitHub",
      },
      sponsor: {
        title: "Support Project",
        description: "If you find this tool helpful, consider supporting the developer",
        paypal: "PayPal",
        paypalUrl: "paypal.me/xcrper",
        wechat: "WeChat Pay",
        alipay: "Alipay",
      },
      disclaimer: {
        title: "Disclaimer",
        content:
          "This app is for learning and reference purposes only. Calculation results do not constitute investment advice. Stock market has risks, invest with caution.",
      },
    },
    validation: {
      price: {
        min: "Price must be greater than 0.01",
        max: "Price must be less than 1 billion",
      },
      boardCount: {
        integer: "Board count must be an integer",
        min: "Board count must be at least 1 day",
        max: "Board count cannot exceed 3650 days",
      },
      dailyReturn: {
        min: "Daily return cannot be less than -99%",
        max: "Daily return cannot exceed 100%",
      },
      stockQuantity: {
        integer: "Stock quantity must be an integer",
        min: "Stock quantity must be at least 1 share",
        max: "Stock quantity cannot exceed 10 billion shares",
      },
      priceZero: "Daily return cannot result in zero or negative price",
      atLeastOneRecord: "Please select at least one record",
    },
  },
} as const;
