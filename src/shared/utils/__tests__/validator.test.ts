import { describe, it, expect } from "bun:test";
import { CalculationParamsSchema, type CalculationParams } from "@/shared/schemas";
import { validateCalculationParams, isFieldValid } from "../validator";

describe("Validator", () => {
  describe("validateCalculationParams", () => {
    it("should validate correct params", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
      };

      expect(() => validateCalculationParams(params)).not.toThrow();
    });

    it("should throw error for invalid initial price", () => {
      const params: CalculationParams = {
        initialPrice: -1,
        boardCount: 5,
        dailyReturn: 10,
      };

      expect(() => validateCalculationParams(params)).toThrow();
    });

    it("should throw error for invalid board count", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: -1,
        dailyReturn: 10,
      };

      expect(() => validateCalculationParams(params)).toThrow();
    });

    it("should throw error for invalid daily return", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 101,
      };

      expect(() => validateCalculationParams(params)).toThrow();
    });

    it("should throw error for daily return less than -99", () => {
      const params: CalculationParams = {
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: -100,
      };

      expect(() => validateCalculationParams(params)).toThrow();
    });
  });

  describe("isFieldValid", () => {
    it("should return true for valid initial price", () => {
      expect(isFieldValid(10, "initialPrice")).toBe(true);
      expect(isFieldValid(0.01, "initialPrice")).toBe(true);
      expect(isFieldValid(99999.99, "initialPrice")).toBe(true);
    });

    it("should return false for invalid initial price", () => {
      expect(isFieldValid(-1, "initialPrice")).toBe(false);
      expect(isFieldValid(0, "initialPrice")).toBe(false);
      expect(isFieldValid(1000000001, "initialPrice")).toBe(false);
    });

    it("should return true for valid board count", () => {
      expect(isFieldValid(1, "boardCount")).toBe(true);
      expect(isFieldValid(10, "boardCount")).toBe(true);
      expect(isFieldValid(365, "boardCount")).toBe(true);
    });

    it("should return false for invalid board count", () => {
      expect(isFieldValid(0, "boardCount")).toBe(false);
      expect(isFieldValid(-1, "boardCount")).toBe(false);
      expect(isFieldValid(366, "boardCount")).toBe(false);
      expect(isFieldValid(1.5, "boardCount")).toBe(false);
    });

    it("should return true for valid daily return", () => {
      expect(isFieldValid(-99, "dailyReturn")).toBe(true);
      expect(isFieldValid(10, "dailyReturn")).toBe(true);
      expect(isFieldValid(100, "dailyReturn")).toBe(true);
    });

    it("should return false for invalid daily return", () => {
      expect(isFieldValid(-100, "dailyReturn")).toBe(false);
      expect(isFieldValid(101, "dailyReturn")).toBe(false);
    });
  });

  describe("getFieldErrorMessage", () => {
    it("should return error message for invalid initial price", () => {
      const result = CalculationParamsSchema.shape.initialPrice.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        const message = result.error.issues[0]?.message;
        expect(message).toContain("0.01");
      }
    });

    it("should return error message for invalid board count", () => {
      const result = CalculationParamsSchema.shape.boardCount.safeParse(0);
      expect(result.success).toBe(false);
      if (!result.success) {
        const message = result.error.issues[0]?.message;
        expect(message).toContain("1");
      }
    });

    it("should return error message for invalid daily return", () => {
      const result = CalculationParamsSchema.shape.dailyReturn.safeParse(-100);
      expect(result.success).toBe(false);
      if (!result.success) {
        const message = result.error.issues[0]?.message;
        expect(message).toContain("-99");
      }
    });
  });

  describe("CalculationParamsSchema", () => {
    it("should validate correct params", () => {
      const result = CalculationParamsSchema.safeParse({
        initialPrice: 10,
        boardCount: 5,
        dailyReturn: 10,
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid initial price", () => {
      const result = CalculationParamsSchema.safeParse({
        initialPrice: -1,
        boardCount: 5,
        dailyReturn: 10,
      });

      expect(result.success).toBe(false);
    });

    it("should reject non-integer board count", () => {
      const result = CalculationParamsSchema.safeParse({
        initialPrice: 10,
        boardCount: 1.5,
        dailyReturn: 10,
      });

      expect(result.success).toBe(false);
    });

    it("should reject daily return that causes zero or negative price", () => {
      const result = CalculationParamsSchema.safeParse({
        initialPrice: 10,
        boardCount: 1,
        dailyReturn: -100,
      });

      expect(result.success).toBe(false);
    });
  });
});
