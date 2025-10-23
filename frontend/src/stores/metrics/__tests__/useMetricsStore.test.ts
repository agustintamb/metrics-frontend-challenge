import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { createMockMetric, createMockMetrics } from "@/test/test-utils";

// Reset store before each test
const initialStoreState = useMetricsStore.getState();

beforeEach(() => {
  useMetricsStore.setState(initialStoreState);
});

describe("useMetricsStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useMetricsStore());

      expect(result.current.metrics).toEqual([]);
      expect(result.current.filteredMetrics).toEqual([]);
      expect(result.current.filters).toEqual({
        timeRange: "historical",
        metric: "activeUsers",
        region: "all",
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.lastUpdated).toBe(null);
    });
  });

  describe("addMetrics", () => {
    it("should add new metrics to the store", () => {
      const { result } = renderHook(() => useMetricsStore());
      const mockMetrics = createMockMetrics(3);

      act(() => {
        result.current.addMetrics(mockMetrics);
      });

      expect(result.current.metrics).toHaveLength(3);
      expect(result.current.filteredMetrics).toHaveLength(3);
      expect(result.current.lastUpdated).toBeTruthy();
      expect(result.current.error).toBe(null);
    });

    it("should sort metrics by timestamp in descending order", () => {
      const { result } = renderHook(() => useMetricsStore());

      const metric1 = createMockMetric({
        timestamp: "2025-10-23T10:00:00.000Z",
      });
      const metric2 = createMockMetric({
        timestamp: "2025-10-23T11:00:00.000Z",
      });
      const metric3 = createMockMetric({
        timestamp: "2025-10-23T09:00:00.000Z",
      });

      act(() => {
        result.current.addMetrics([metric1, metric2, metric3]);
      });

      expect(result.current.metrics[0].timestamp).toBe(
        "2025-10-23T11:00:00.000Z"
      );
      expect(result.current.metrics[1].timestamp).toBe(
        "2025-10-23T10:00:00.000Z"
      );
      expect(result.current.metrics[2].timestamp).toBe(
        "2025-10-23T09:00:00.000Z"
      );
    });

    it("should not add duplicate metrics with same timestamp", () => {
      const { result } = renderHook(() => useMetricsStore());
      const metric = createMockMetric({
        timestamp: "2025-10-23T10:00:00.000Z",
      });

      act(() => {
        result.current.addMetrics([metric]);
      });

      expect(result.current.metrics).toHaveLength(1);

      act(() => {
        result.current.addMetrics([metric]); // Try to add same metric again
      });

      expect(result.current.metrics).toHaveLength(1); // Should still be 1
    });

    it("should handle empty metrics array", () => {
      const { result } = renderHook(() => useMetricsStore());

      act(() => {
        result.current.addMetrics([]);
      });

      expect(result.current.metrics).toEqual([]);
      expect(result.current.filteredMetrics).toEqual([]);
    });
  });

  describe("updateFilters", () => {
    beforeEach(() => {
      const { result } = renderHook(() => useMetricsStore());
      const mockMetrics = createMockMetrics(10);

      act(() => {
        result.current.addMetrics(mockMetrics);
      });
    });

    it("should update filters and re-filter metrics", () => {
      const { result } = renderHook(() => useMetricsStore());

      act(() => {
        result.current.updateFilters({ metric: "revenue" });
      });

      expect(result.current.filters.metric).toBe("revenue");
      expect(result.current.filters.timeRange).toBe("historical"); // Should keep other filters
    });
  });

  describe("setLoading", () => {
    it("should update loading state", () => {
      const { result } = renderHook(() => useMetricsStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("setError", () => {
    it("should update error state and set loading to false", () => {
      const { result } = renderHook(() => useMetricsStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setError("Something went wrong");
      });

      expect(result.current.error).toBe("Something went wrong");
      expect(result.current.isLoading).toBe(false);
    });

    it("should clear error when null is passed", () => {
      const { result } = renderHook(() => useMetricsStore());

      act(() => {
        result.current.setError("Error message");
      });

      expect(result.current.error).toBe("Error message");

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe("getLatestMetric", () => {
    it("should return the most recent metric", () => {
      const { result } = renderHook(() => useMetricsStore());

      const metric1 = createMockMetric({
        timestamp: "2025-10-23T10:00:00.000Z",
        activeUsers: 100,
      });
      const metric2 = createMockMetric({
        timestamp: "2025-10-23T11:00:00.000Z",
        activeUsers: 200,
      });

      act(() => {
        result.current.addMetrics([metric1, metric2]);
      });

      const latest = result.current.getLatestMetric();
      expect(latest?.activeUsers).toBe(200);
      expect(latest?.timestamp).toBe("2025-10-23T11:00:00.000Z");
    });

    it("should return null when no metrics exist", () => {
      const { result } = renderHook(() => useMetricsStore());

      const latest = result.current.getLatestMetric();
      expect(latest).toBe(null);
    });

    it("should return null when filtered metrics is empty", () => {
      const { result } = renderHook(() => useMetricsStore());

      // Add old metrics
      const oldMetric = createMockMetric({
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      });

      act(() => {
        result.current.addMetrics([oldMetric]);
        result.current.updateFilters({ timeRange: "last-minute" });
      });

      const latest = result.current.getLatestMetric();
      expect(latest).toBe(null);
    });
  });

  describe("getPaginatedMetrics", () => {
    beforeEach(() => {
      const { result } = renderHook(() => useMetricsStore());
      const mockMetrics = createMockMetrics(25); // 25 metrics for pagination testing

      act(() => {
        result.current.addMetrics(mockMetrics);
      });
    });

    it("should return correct pagination data for first page", () => {
      const { result } = renderHook(() => useMetricsStore());

      const paginatedData = result.current.getPaginatedMetrics(1, 10);

      expect(paginatedData.data).toHaveLength(10);
      expect(paginatedData.totalPages).toBe(3); // 25 / 10 = 2.5, rounded up to 3
      expect(paginatedData.totalItems).toBe(25);
    });

    it("should return correct data for middle page", () => {
      const { result } = renderHook(() => useMetricsStore());

      const paginatedData = result.current.getPaginatedMetrics(2, 10);

      expect(paginatedData.data).toHaveLength(10);
      expect(paginatedData.totalPages).toBe(3);
      expect(paginatedData.totalItems).toBe(25);
    });

    it("should return correct data for last page", () => {
      const { result } = renderHook(() => useMetricsStore());

      const paginatedData = result.current.getPaginatedMetrics(3, 10);

      expect(paginatedData.data).toHaveLength(5); // Last page has 5 items
      expect(paginatedData.totalPages).toBe(3);
      expect(paginatedData.totalItems).toBe(25);
    });

    it("should handle page out of bounds", () => {
      const { result } = renderHook(() => useMetricsStore());

      const paginatedData = result.current.getPaginatedMetrics(5, 10); // Page 5 doesn't exist

      expect(paginatedData.data).toHaveLength(0);
      expect(paginatedData.totalPages).toBe(3);
      expect(paginatedData.totalItems).toBe(25);
    });

    it("should handle different page sizes", () => {
      const { result } = renderHook(() => useMetricsStore());

      const paginatedData = result.current.getPaginatedMetrics(1, 5);

      expect(paginatedData.data).toHaveLength(5);
      expect(paginatedData.totalPages).toBe(5); // 25 / 5 = 5
      expect(paginatedData.totalItems).toBe(25);
    });

    it("should handle empty metrics", () => {
      const { result } = renderHook(() => useMetricsStore());

      // Clear metrics
      act(() => {
        useMetricsStore.setState({ metrics: [], filteredMetrics: [] });
      });

      const paginatedData = result.current.getPaginatedMetrics(1, 10);

      expect(paginatedData.data).toHaveLength(0);
      expect(paginatedData.totalPages).toBe(0);
      expect(paginatedData.totalItems).toBe(0);
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle multiple filter updates correctly", () => {
      const { result } = renderHook(() => useMetricsStore());

      // Create metrics spanning different time periods
      const now = new Date();
      const metrics = [
        createMockMetric({
          timestamp: new Date(now.getTime() - 30000).toISOString(), // 30 seconds ago
          activeUsers: 100,
        }),
        createMockMetric({
          timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
          activeUsers: 200,
        }),
        createMockMetric({
          timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
          activeUsers: 300,
        }),
      ];

      act(() => {
        result.current.addMetrics(metrics);
      });

      // Test historical filter (should show all)
      expect(result.current.filteredMetrics).toHaveLength(3);

      // Test last-minute filter
      act(() => {
        result.current.updateFilters({ timeRange: "last-minute" });
      });
      expect(result.current.filteredMetrics).toHaveLength(1);

      // Test last-hour filter
      act(() => {
        result.current.updateFilters({ timeRange: "last-hour" });
      });
      expect(result.current.filteredMetrics).toHaveLength(2);

      // Back to historical
      act(() => {
        result.current.updateFilters({ timeRange: "historical" });
      });
      expect(result.current.filteredMetrics).toHaveLength(3);
    });

    it("should maintain filter state when adding new metrics", () => {
      const { result } = renderHook(() => useMetricsStore());

      // Set filter first
      act(() => {
        result.current.updateFilters({ timeRange: "last-minute" });
      });

      // Add metrics
      const now = new Date();
      const recentMetric = createMockMetric({
        timestamp: new Date(now.getTime() - 30000).toISOString(),
      });
      const oldMetric = createMockMetric({
        timestamp: new Date(now.getTime() - 120000).toISOString(),
      });

      act(() => {
        result.current.addMetrics([recentMetric, oldMetric]);
      });

      // Should still respect the filter
      expect(result.current.filteredMetrics).toHaveLength(1);
      expect(result.current.filters.timeRange).toBe("last-minute");
    });
  });
});
