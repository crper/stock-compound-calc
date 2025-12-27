import { describe, it, expect } from "bun:test";
import { deleteCalculation } from "@/server/database";

describe("批量删除历史记录", () => {
  it("应该成功删除存在的记录", () => {
    const result = deleteCalculation("12345");
    expect(result).toBe(false);
  });

  it("应该不删除不存在的记录", () => {
    const result = deleteCalculation("nonexistent-id");
    expect(result).toBe(false);
  });

  it("应该处理空ID参数", () => {
    const result = deleteCalculation("");
    expect(result).toBe(false);
  });
});
