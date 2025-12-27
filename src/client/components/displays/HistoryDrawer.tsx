/**
 * 历史记录抽屉组件
 * 展示和管理计算历史记录
 */
import {
  FallOutlined,
  RiseOutlined,
  CalculatorOutlined,
  ClearOutlined,
  HistoryOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Button,
  Card,
  Drawer,
  Empty,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
  Input,
  Select,
  DatePicker,
  Checkbox,
  message,
} from "antd";
import React, { useState, useMemo } from "react";
import type { CalculationHistory } from "@/shared/types";
import { CARD_COLORS } from "@/shared/constants";
import { formatCurrency, formatDate, formatPercentage } from "@/shared/utils/formatters";

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface HistoryDrawerProps {
  visible: boolean;
  onClose: () => void;
  history: CalculationHistory[];
  isMobile: boolean;
  onLoadHistory: (item: CalculationHistory) => void;
  onClearHistory: () => void;
  onDeleteHistory?: (ids: string[]) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = React.memo(
  ({ visible, onClose, history, isMobile, onLoadHistory, onClearHistory, onDeleteHistory }) => {
    const [clearing, setClearing] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [dailyReturnFilter, setDailyReturnFilter] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleClearHistory = async () => {
      setClearing(true);
      onClearHistory();
      setClearing(false);
      setSelectedIds(new Set());
    };

    const handleBatchDelete = async () => {
      if (selectedIds.size === 0) {
        message.warning("请先选择要删除的记录");
        return;
      }

      if (onDeleteHistory) {
        onDeleteHistory(Array.from(selectedIds));
        setSelectedIds(new Set());
        message.success(`已删除 ${selectedIds.size} 条记录`);
      } else {
        message.error("批量删除功能暂未实现");
      }
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(filteredHistory.map((item) => item.id)));
      } else {
        setSelectedIds(new Set());
      }
    };

    const handleSelectItem = (id: string, checked: boolean, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    };

    const filteredHistory = useMemo(() => {
      return history.filter((item) => {
        const matchesSearch =
          searchValue === "" || item.params.initialPrice.toString().includes(searchValue);

        const itemDate = dayjs(item.timestamp).startOf("day");
        const matchesDateRange =
          !dateRange[0] ||
          !dateRange[1] ||
          (itemDate.isAfter(dateRange[0].startOf("day").subtract(1, "second")) &&
            itemDate.isBefore(dateRange[1].endOf("day").add(1, "second")));

        const matchesDailyReturn =
          dailyReturnFilter === null || item.params.dailyReturn === dailyReturnFilter;

        return matchesSearch && matchesDateRange && matchesDailyReturn;
      });
    }, [history, searchValue, dateRange, dailyReturnFilter]);

    const uniqueDailyReturns = useMemo(() => {
      const returns = new Set(history.map((item) => item.params.dailyReturn));
      return Array.from(returns).sort((a, b) => a - b);
    }, [history]);

    const DailyReturnOptions = uniqueDailyReturns.map((value) => ({
      label: `${value}%`,
      value,
    }));

    return (
      <Drawer
        title={
          <Space>
            <HistoryOutlined />
            <span>计算历史</span>
            {filteredHistory.length > 0 && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {filteredHistory.length} 条记录
              </Tag>
            )}
          </Space>
        }
        placement={isMobile ? "bottom" : "right"}
        onClose={onClose}
        open={visible}
        size={isMobile ? "large" : "default"}
        className={isMobile ? "history-drawer-mobile" : ""}
        styles={{
          body: { padding: "16px" },
        }}
        extra={
          selectedIds.size > 0 ? (
            <Space>
              <Text type="secondary">已选 {selectedIds.size} 项</Text>
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedIds.size} 条记录吗？`}
                onConfirm={handleBatchDelete}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
              <Button size="small" onClick={() => setSelectedIds(new Set())}>
                取消选择
              </Button>
            </Space>
          ) : (
            history.length > 0 && (
              <Popconfirm
                title="确认清空"
                description="确定要清空所有历史记录吗？此操作不可恢复。"
                onConfirm={handleClearHistory}
                okText="确认"
                cancelText="取消"
                okButtonProps={{ danger: true, loading: clearing }}
              >
                <Button
                  size="small"
                  danger
                  icon={<ClearOutlined />}
                  style={{ transition: "all 0.3s ease" }}
                >
                  清空历史
                </Button>
              </Popconfirm>
            )
          )
        }
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {history.length > 0 && (
            <Card size="small" className="dark:bg-gray-800">
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Input
                  placeholder="搜索初始股价"
                  prefix={<SearchOutlined />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  allowClear
                />
                <Space size="small" wrap>
                  <RangePicker
                    placeholder={["开始日期", "结束日期"]}
                    value={dateRange}
                    onChange={(dates) => setDateRange([dates?.[0] ?? null, dates?.[1] ?? null])}
                    size="small"
                    style={{ width: isMobile ? "100%" : "auto" }}
                  />
                  <Select
                    placeholder="涨跌幅"
                    value={dailyReturnFilter}
                    onChange={setDailyReturnFilter}
                    options={[{ label: "全部", value: null }, ...DailyReturnOptions]}
                    allowClear
                    style={{ width: 120 }}
                    size="small"
                  />
                </Space>
                {filteredHistory.length > 0 && (
                  <Checkbox
                    checked={selectedIds.size === filteredHistory.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  >
                    全选
                  </Checkbox>
                )}
              </Space>
            </Card>
          )}

          {filteredHistory.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                  {history.length === 0 ? "暂无历史记录" : "未找到匹配的记录"}
                </span>
              }
              style={{ transition: "all 0.3s ease" }}
            >
              {history.length === 0 && (
                <div style={{ marginTop: 16 }}>
                  <HistoryOutlined
                    style={{ fontSize: 48 }}
                    className="text-gray-300 dark:text-gray-600"
                  />
                </div>
              )}
            </Empty>
          ) : (
            filteredHistory.map((item, index) => (
              <HistoryCard
                key={item.id}
                item={item}
                isMobile={isMobile}
                index={index}
                selected={selectedIds.has(item.id)}
                onSelect={(checked, event) => handleSelectItem(item.id, checked, event)}
                onClick={() => {
                  if (selectedIds.size > 0) {
                    handleSelectItem(item.id, !selectedIds.has(item.id), {
                      stopPropagation: () => {},
                      preventDefault: () => {},
                      defaultPrevented: false,
                    } as any);
                  } else {
                    onLoadHistory(item);
                    onClose();
                  }
                }}
              />
            ))
          )}
        </Space>
      </Drawer>
    );
  },
);

HistoryDrawer.displayName = "HistoryDrawer";

interface HistoryCardProps {
  item: CalculationHistory;
  isMobile: boolean;
  index: number;
  selected?: boolean;
  onSelect?: (checked: boolean, event: React.MouseEvent) => void;
  onClick: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = React.memo(
  ({ item, isMobile, index, selected = false, onSelect, onClick }) => {
    const formattedTimestamp = formatDate(item.timestamp);

    const handleCardClick = () => {
      onClick();
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
      e.stopPropagation();
      onSelect?.(e.target.checked, {
        stopPropagation: () => {},
        preventDefault: () => {},
        defaultPrevented: false,
      } as any);
    };

    return (
      <Card
        size={isMobile ? "default" : "small"}
        hoverable
        style={{
          animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
          border: selected ? "2px solid #1890ff" : undefined,
        }}
        onClick={handleCardClick}
        styles={{
          body: { padding: isMobile ? "16px" : "12px" },
        }}
        className="history-card mb-2 sm:mb-3 transition-all duration-300 dark:bg-gray-800"
      >
        <div className="text-[13px] sm:text-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 overflow-hidden" style={{ flex: 1 }}>
              {onSelect && (
                <Checkbox
                  checked={selected}
                  onChange={handleCheckboxChange}
                  style={{ marginRight: 4 }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <CalculatorOutlined style={{ color: "#1890ff" }} />
              <span className="font-semibold text-[14px] sm:text-[15px] dark:text-gray-200 truncate">
                {formatCurrency(item.params.initialPrice, {
                  compact: item.params.initialPrice >= 1000000,
                })}
              </span>
              <span className="text-gray-400 flex-shrink-0">×</span>
              <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">
                {item.params.boardCount}天
              </span>
            </div>
            <Tooltip title={`涨跌幅: ${item.params.dailyReturn}%`}>
              <Tag color="blue" style={{ margin: 0 }}>
                {formatPercentage(item.params.dailyReturn)}
              </Tag>
            </Tooltip>
          </div>

          <div className="text-center mb-4">
            <Text type="secondary" className="text-xs">
              <HistoryOutlined style={{ fontSize: 12, marginRight: 4 }} />
              {formattedTimestamp}
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HistoryResultCard result={item.results.up} type="up" />
            <HistoryResultCard result={item.results.down} type="down" />
          </div>
        </div>
      </Card>
    );
  },
);

HistoryCard.displayName = "HistoryCard";

interface HistoryResultCardProps {
  result: { finalPrice: number; totalReturn: number; totalGain: number };
  type: "up" | "down";
}

const HistoryResultCard: React.FC<HistoryResultCardProps> = React.memo(({ result, type }) => {
  const isUp = type === "up";
  const IconComponent = isUp ? RiseOutlined : FallOutlined;
  const title = isUp ? "涨停收益" : "跌停收益";
  const colors = isUp ? CARD_COLORS.up : CARD_COLORS.down;

  return (
    <div
      className={`text-center p-3 rounded-lg ${colors.bg} border ${colors.border} ${colors.darkBg} ${colors.darkBorder}`}
    >
      <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center">
        <IconComponent style={{ fontSize: 12 }} className={`${colors.iconColor} mr-1`} />
        {title}
      </div>
      <div
        className={`font-bold ${colors.iconColor} ${
          result.finalPrice >= 1000000 ? "text-sm sm:text-base" : "text-base sm:text-lg"
        }`}
      >
        {formatCurrency(result.finalPrice, { compact: result.finalPrice >= 1000000 })}
      </div>
      <div className={`text-[13px] ${colors.iconColor}`}>
        {formatPercentage(result.totalReturn, { multiply: false })}
      </div>
      <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 truncate">
        {isUp ? "+" : ""}
        {formatCurrency(result.totalGain, { compact: Math.abs(result.totalGain) >= 1000000 })}
      </div>
    </div>
  );
});

HistoryResultCard.displayName = "HistoryResultCard";
