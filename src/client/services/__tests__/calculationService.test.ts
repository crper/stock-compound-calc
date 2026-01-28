import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { calculationService } from "../calculationService";
import { API_CONSTANTS } from "@/shared/constants";

describe("calculationService", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // @ts-expect-error - Bun mock is not fully compatible with fetch types
    global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ success: true, data: [] }))));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should save calculation successfully", async () => {
    const mockData = { id: "123", results: {}, timestamp: new Date().toISOString(), params: {} };
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true, data: mockData }))
      )
    );

    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    const result = await calculationService.saveCalculation(params);

    expect(result).toEqual(mockData as any);
    expect(global.fetch).toHaveBeenCalledWith(`${API_CONSTANTS.BASE_URL}/calculations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  });

  it("should handle error when saving calculation fails", async () => {
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: false, error: "Validation failed" }))
      )
    );

    const params = { initialPrice: 10, boardCount: 5, dailyReturn: 10 };
    expect(calculationService.saveCalculation(params)).rejects.toThrow("Validation failed");
  });

  it("should get all history", async () => {
    const mockHistory = [{ id: "1" }, { id: "2" }];
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true, data: mockHistory }))
      )
    );

    const result = await calculationService.getAllHistory();
    expect(result).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(`${API_CONSTANTS.BASE_URL}/calculations`);
  });

  it("should get paginated history", async () => {
    const mockData = { data: [], pagination: {} };
    // @ts-expect-error - Bun mock
    global.fetch = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true, data: mockData }))
      )
    );

    const result = await calculationService.getPaginatedHistory(1, 10);
    // The service returns result.data which IS mockData in this case?
    // calculationService: const result = await response.json(); return result;
    // So if response.json() is { success: true, data: mockData }...
    // WAIT. My service implementation:
    // const result = await response.json(); return result;
    // result is ApiResponse.
    // So getPaginatedHistory returns { success: true, data: ..., ... } ?
    // In service: return result;
    // In hook: const response = await ...; return response.data;
    // Let's check service again.
    expect(result).toEqual({ success: true, data: mockData } as any);
    expect(global.fetch).toHaveBeenCalledWith(`${API_CONSTANTS.BASE_URL}/calculations?page=1&limit=10`);
  });
});
