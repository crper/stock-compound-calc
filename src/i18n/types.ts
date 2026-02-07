// 类型定义文件

// 翻译资源类型定义
export interface TranslationResources {
  common: {
    navigation: {
      stockCalculator: string;
      lossRecovery: string;
      about: string;
      menuTitle: string;
    };
    buttons: {
      history: string;
      batchDelete: string;
      cancelSelection: string;
      clearHistory: string;
      confirm: string;
      cancel: string;
      close: string;
      delete: string;
      collapseLess: string;
      expandMore: string;
      retry: string;
    };
    languages: {
      chinese: string;
      english: string;
    };
    footer: {
      copyright: string;
      disclaimer: string;
    };
    tags: {
      history: string;
      recoveryAnalysis: string;
    };
    tooltips: {
      languageToggle: string;
      historyButton: string;
    };
    empty: {
      noHistory: string;
      noData: string;
    };
    messages: {
      selectFirst: string;
      deleteSuccess: string;
      deleteFailed: string;
      clearSuccess: string;
      clearFailed: string;
    };
    errorBoundary: {
      title: string;
      description: string;
      details: string;
      tryAgain: string;
    };
  };
  stockCalculator: {
    form: {
      title: string;
      initialPrice: string;
      stockQuantity: string;
      dailyReturn: string;
      boardCount: string;
      units: {
        yuan: string;
        shares: string;
        days: string;
      };
      placeholders: {
        initialPrice: string;
      };
      tooltips: {
        initialPrice: string;
        stockQuantity: string;
      };
      sliderDescriptions: {
        dailyReturn: string;
        boardCount: string;
      };
      presets: {
        label: string;
      };
      initialMarketValue: string;
    };
    results: {
      empty: {
        title: string;
        subtitle: string;
      };
      overview: {
        consecutiveUp: string;
        consecutiveDown: string;
        days: string;
      };
      metrics: {
        doubleDays: string;
        breakEvenReturn: string;
        breakEvenTooltip: string;
        tenXDays: string;
        tenXTooltip: string;
        annualizedReturn: string;
        annualizedTooltip: string;
        title: string;
        dynamicTooltip: string;
      };
      positionChange: {
        title: string;
        shares: string;
        initialMarketValue: string;
        finalMarketValue: string;
        profitLoss: string;
      };
      priceChange: {
        title: string;
        initial: string;
        final: string;
      };
    };
    history: {
      title: string;
      recordCount: string;
      selectedCount: string;
      searchPlaceholder: string;
      dateRange: {
        start: string;
        end: string;
      };
      filterReturn: string;
      filterAll: string;
      selectAll: string;
      confirmDelete: string;
      confirmDeleteDesc: string;
      confirmClear: string;
      confirmClearDesc: string;
      noMatch: string;
      holding: string;
      limitUpProfit: string;
      limitDownLoss: string;
    };
    charts: {
      title: string;
      loading: string;
      noData: string;
      error: {
        title: string;
        message: string;
      };
      types: {
        bar: string;
        line: string;
      };
      limitUp: string;
      limitDown: string;
    };
    errors: {
      inputError: string;
    };
  };
  recoveryCalculator: {
    title: string;
    form: {
      title: string;
      currentLoss: string;
      unit: string;
      sliderDescription: string;
      presets: {
        label: string;
      };
    };
    results: {
      title: string;
      difficulty: {
        label: string;
      };
      currentLoss: string;
      requiredGain: string;
      multiplier: string;
      multiplierDesc: string;
      warnings: {
        highRisk: {
          title: string;
          desc: string;
        };
        severe: {
          title: string;
          desc: string;
        };
      };
    };
    table: {
      title: string;
      range: string;
      columns: {
        loss: string;
        required: string;
        multiplier: string;
      };
      formula: string;
    };
    history: {
      title: string;
    };
  };
  about: {
    description: string;
    techStack: {
      title: string;
      frontend: string;
      backend: string;
      database: string;
      tools: string;
      list: {
        bun: string;
        react: string;
        typescript: string;
        antd: string;
        tailwind: string;
        indexeddb: string;
        dexie: string;
        reactRouter: string;
        recharts: string;
        decimal: string;
        zod: string;
        i18next: string;
      };
    };
    features: {
      title: string;
      stock: {
        title: string;
        desc: string;
      };
      recovery: {
        title: string;
        desc: string;
      };
      visualization: {
        title: string;
        desc: string;
      };
      history: {
        title: string;
        desc: string;
      };
    };
    developer: {
      title: string;
      description: string;
      github: string;
    };
    sponsor: {
      title: string;
      description: string;
      paypal: string;
      paypalUrl: string;
      wechat: string;
      alipay: string;
    };
    disclaimer: {
      title: string;
      content: string;
    };
  };
  validation: {
    price: {
      min: string;
      max: string;
    };
    boardCount: {
      integer: string;
      min: string;
      max: string;
    };
    dailyReturn: {
      min: string;
      max: string;
    };
    stockQuantity: {
      integer: string;
      min: string;
      max: string;
    };
    priceZero: string;
    atLeastOneRecord: string;
  };
}

// i18n 资源类型
export type I18nResources = {
  [L in "zh-CN" | "en-US"]: {
    translation: TranslationResources;
  };
};
