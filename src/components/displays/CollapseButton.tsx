/**
 * 折叠/展开按钮组件
 * 位于卡片底部中央
 */
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import React from "react";

interface CollapseButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const CollapseButton: React.FC<CollapseButtonProps> = React.memo(
  ({ isExpanded, onClick }) => (
    <div className="flex justify-center mt-4">
      <Button
        type="text"
        size="small"
        icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
        onClick={onClick}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        {isExpanded ? "收起详情" : "展开详情"}
      </Button>
    </div>
  ),
);

CollapseButton.displayName = "CollapseButton";
