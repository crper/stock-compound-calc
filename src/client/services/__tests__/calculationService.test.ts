import { API_CONSTANTS } from "@/shared/constants";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { calculationService } from "../calculationService";

describe("calculationService", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // @ts-expect-error - Bun mock is not fully compatible with fetch types
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true, data: [] }))),
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should save calculation successfully", async () => {
    const mockData = { id: "123", results: {}, timestamp: new Date().toISOString(), params: {} };
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true, data: mockData }))),
    );

    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const result = await calculationService.saveCalculation(params);

    expect(result).toEqual(mockData as any);
    // fetchWithTimeout adds signal, so we check the URL and basic structure
    expect(global.fetch).toHaveBeenCalled();
    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[0]).toBe(`${API_CONSTANTS.BASE_URL}/calculations`);
    expect(callArgs[1].method).toBe("POST");
    expect(callArgs[1].headers["Content-Type"]).toBe("application/json");
    expect(callArgs[1].body).toBe(JSON.stringify(params));
  });

  it("should handle error when saving calculation fails", async () => {
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ success: false, error: "Validation failed" }))),
    );

    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    expect(calculationService.saveCalculation(params)).rejects.toThrow("Validation failed");
  });

  it("should get all history", async () => {
    const mockHistory = [{ id: "1" }, { id: "2" }];
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true, data: mockHistory }))),
    );

    const result = await calculationService.getAllHistory();
    expect(result).toHaveLength(2);
    // fetchWithTimeout adds signal as second argument
    expect(global.fetch).toHaveBeenCalled();
    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[0]).toBe(`${API_CONSTANTS.BASE_URL}/calculations`);
  });

  it("should get paginated history", async () => {
    const mockData = { data: [], pagination: {} };
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ success: true, data: mockData }))),
    );

    const result = await calculationService.getPaginatedHistory(1, 10);
    // handleResponse returns result.data
    expect(result).toEqual(mockData as any);
    expect(global.fetch).toHaveBeenCalled();
    const callArgs = (global.fetch as any).mock.calls[0];
    expect(callArgs[0]).toBe(`${API_CONSTANTS.BASE_URL}/calculations?page=1&limit=10`);
  });
});
