/**
 * ID 生成工具
 * 提供统一的 ID 生成逻辑
 */

/**
 * 生成带时间戳的唯一 ID
 * 格式: {timestamp}-{randomString}
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).slice(2, 13);
  return `${timestamp}-${randomStr}`;
};
