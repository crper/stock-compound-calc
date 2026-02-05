/**
 * 通用加载状态组件
 * 直接使用 Ant Design Spin 组件
 */
import { Spin } from "antd";
import React from "react";

interface LoadingStateProps {
  /** 是否正在加载 */
  loading: boolean;
  /** 加载提示文本 */
  text?: string;
  /** 子组件内容 */
  children: React.ReactNode;
  /** 是否显示遮罩 */
  showOverlay?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = React.memo(
  ({ loading, text, children, showOverlay = true }) => (
    <Spin spinning={loading} tip={text} wrapperClassName={showOverlay ? "min-h-[100px]" : ""}>
      {children}
    </Spin>
  ),
);

LoadingState.displayName = "LoadingState";
