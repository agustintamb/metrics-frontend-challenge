import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { metricConfigs } from "@/constants";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDateTime,
  formatTime,
  calculateTrend,
  tickFormatter,
  debounce,
  cn,
} from "@/utils";

describe("Utils - Formatters", () => {
  describe("formatCurrency", () => {
    it("should format currency in ARS without decimals", () => {
      expect(formatCurrency(0)).toBe("$\u00A00");
      expect(formatCurrency(1500)).toBe("$\u00A01.500");
      expect(formatCurrency(1000000)).toBe("$\u00A01.000.000");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with thousands separators", () => {
      expect(formatNumber(1500)).toBe("1.500");
      expect(formatNumber(0)).toBe("0");
      expect(formatNumber(1000000)).toBe("1.000.000");
      expect(formatNumber(42)).toBe("42");
    });
  });

  describe("formatPercentage", () => {
    it("should format decimal numbers as percentages", () => {
      expect(formatPercentage(0.05)).toBe("5.00 %");
      expect(formatPercentage(0.123)).toBe("12.30 %");
      expect(formatPercentage(1)).toBe("100.00 %");
      expect(formatPercentage(0)).toBe("0.00 %");
    });
  });

  describe("formatDateTime", () => {
    it("should format ISO date strings correctly", () => {
      const timestamp = "2025-10-23T14:30:45.000Z";
      const formatted = formatDateTime(timestamp);

      // Verificamos que contenga los elementos esperados
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/); // fecha
      expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/); // hora
    });
  });

  describe("formatTime", () => {
    it("should format time only from ISO string", () => {
      const timestamp = "2025-10-23T14:30:45.000Z";
      const formatted = formatTime(timestamp);

      expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });
});

describe("Utils - Calculations", () => {
  describe("calculateTrend", () => {
    it('should return "up" when current > previous', () => {
      expect(calculateTrend(100, 50)).toBe("up");
    });

    it('should return "down" when current < previous', () => {
      expect(calculateTrend(50, 100)).toBe("down");
    });

    it('should return "neutral" when current === previous', () => {
      expect(calculateTrend(50, 50)).toBe("neutral");
    });

    it('should return "neutral" when previous is undefined', () => {
      expect(calculateTrend(50)).toBe("neutral");
      expect(calculateTrend(50, undefined)).toBe("neutral");
    });
  });

  describe("tickFormatter", () => {
    it("should format revenue values in thousands", () => {
      const revenueConfig = metricConfigs.revenue;
      expect(tickFormatter(5000, revenueConfig)).toBe("5K");
      expect(tickFormatter(16000, revenueConfig)).toBe("16K");
    });

    it("should format churn rate as percentage", () => {
      const churnConfig = metricConfigs.churnRate;
      expect(tickFormatter(0.05, churnConfig)).toBe("0.1%");
      expect(tickFormatter(0.125, churnConfig)).toBe("0.1%");
    });

    it("should format other metrics as regular numbers", () => {
      const activeUsersConfig = metricConfigs.activeUsers;
      expect(tickFormatter(1500, activeUsersConfig)).toBe("1.500");
      expect(tickFormatter(1000000, activeUsersConfig)).toBe("1.000.000");
    });
  });
});

describe("Utils - Helpers", () => {
  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should delay function execution", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("test");
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("should cancel previous calls when called multiple times", () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("first");
      debouncedFn("second");
      debouncedFn("third");

      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("third");
    });
  });

  describe("cn", () => {
    it("should concatenate valid class names", () => {
      expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
    });

    it("should filter out falsy values", () => {
      expect(cn("class1", null, undefined, false, "", "class2")).toBe(
        "class1 class2"
      );
    });

    it("should handle empty input", () => {
      expect(cn()).toBe("");
      expect(cn(null, undefined, false)).toBe("");
    });
  });
});
