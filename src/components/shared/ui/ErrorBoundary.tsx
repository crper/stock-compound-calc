/**
 * React 错误边界组件
 * 捕获并处理组件树中的 JavaScript 错误
 */
import { Alert, Button } from "antd";
import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { createErrorBoundary } from "@/utils/errorHandler";

interface Props {
  /** 子组件 */
  children: ReactNode;
  /** 自定义错误展示组件 */
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface State {
  /** 是否发生错误 */
  hasError: boolean;
  /** 错误对象 */
  error: Error | null;
}

/**
 * 默认错误展示组件
 */
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <Alert
      title="应用程序遇到错误"
      description={
        <div>
          <p>很抱歉，应用程序遇到了一个意外错误。</p>
          <details style={{ whiteSpace: "pre-wrap", marginTop: "12px" }}>
            <summary className="dark:text-gray-300">错误详情（点击展开）</summary>
            <code
              style={{
                display: "block",
                padding: "8px",
                borderRadius: "4px",
                marginTop: "8px",
                fontSize: "12px",
                textAlign: "left",
              }}
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            >
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </code>
          </details>
        </div>
      }
      type="error"
      showIcon
      action={
        <Button size="small" danger onClick={retry}>
          重试
        </Button>
      }
    />
  </div>
);

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private readonly maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * 静态方法：捕获子组件抛出的错误
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * 捕获错误信息并记录日志
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorBoundary = createErrorBoundary();
    errorBoundary.handleError(error, errorInfo);
  }

  /**
   * 重试功能
   */
  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: null });
    } else {
      // 超过最大重试次数，刷新页面
      window.location.reload();
    }
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
