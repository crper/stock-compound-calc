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

/**
 * 生成纯数字 ID（基于时间戳）
 * 适合需要数值 ID 的场景
 */
export const generateNumericId = (): string => {
  return Date.now().toString();
};

/**
 * 生成短 ID（适合临时标识）
 * 格式: {randomString}
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).slice(2, 10);
};
