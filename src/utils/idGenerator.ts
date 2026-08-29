/**
 * ID 生成工具
 * 使用浏览器原生的 crypto.randomUUID（要求 secure context，localhost 与 HTTPS 均满足）
 */

// 极旧浏览器 / 非安全上下文的兜底，保持与旧记录相同的 {ts}-{rand} 格式
const generateLegacyId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).slice(2, 13);
  return `${timestamp}-${randomStr}`;
};

export const generateId = (): string => crypto.randomUUID?.() ?? generateLegacyId();
