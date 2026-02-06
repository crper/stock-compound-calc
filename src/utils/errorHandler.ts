import i18n from "@/i18n";

export enum ErrorType {
  VALIDATION = "VALIDATION",
  CALCULATION = "CALCULATION",
  NETWORK = "NETWORK",
  SYSTEM = "SYSTEM",
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(type: ErrorType, message: string, code?: string, context?: Record<string, any>) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toUserMessage(): string {
    const prefix = i18n.t(`common.errors.types.${this.type.toLowerCase()}`);

    if (this.type === ErrorType.NETWORK || this.type === ErrorType.SYSTEM) {
      return prefix;
    }

    return `${prefix}: ${this.message}`;
  }

  toLogFormat(): {
    type: ErrorType;
    message: string;
    code?: string;
    context?: Record<string, any>;
    timestamp: string;
    stack?: string;
  } {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

export const ErrorFactory = {
  validation(message: string, fieldName?: string, value?: unknown): AppError {
    return new AppError(ErrorType.VALIDATION, message, "VALIDATION_ERROR", { fieldName, value });
  },

  calculation(message: string, params?: Record<string, unknown>): AppError {
    return new AppError(ErrorType.CALCULATION, message, "CALCULATION_ERROR", { params });
  },

  network(message: string, url?: string, statusCode?: number): AppError {
    return new AppError(ErrorType.NETWORK, message, "NETWORK_ERROR", { url, statusCode });
  },

  system(message: string, originalError?: Error): AppError {
    return new AppError(ErrorType.SYSTEM, message, "SYSTEM_ERROR", {
      originalError: originalError?.message,
    });
  },
};

export class ErrorHandler {
  static handleUnknown(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return ErrorFactory.system(error.message, error);
    }

    if (typeof error === "string") {
      return ErrorFactory.system(error);
    }

    return ErrorFactory.system("未知错误");
  }

  static log(error: AppError): void {
    const logData = error.toLogFormat();

    if (process.env.NODE_ENV === "development") {
      console.error("[App Error]", logData);
    } else {
      console.error("[App Error]", {
        type: logData.type,
        message: logData.message,
        code: logData.code,
        timestamp: logData.timestamp,
      });
    }
  }
}

export const createErrorBoundary = () => {
  return {
    handleError: (error: Error, errorInfo: React.ErrorInfo) => {
      const appError = new AppError(
        ErrorType.SYSTEM,
        `React Error Boundary: ${error.message}`,
        "SYSTEM_ERROR",
        {
          originalError: error.message,
          errorInfo,
        },
      );
      ErrorHandler.log(appError);
    },
  };
};
