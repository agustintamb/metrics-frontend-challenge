import { create } from "zustand";
import { initialStateMetrics } from "./initialState";
import { MetricData, DashboardFilters } from "@/interfaces/metrics";
import { IMetricsStore } from "./types";

// Apply filters to metrics and return the filtered list
const applyFilters = (
  metrics: MetricData[],
  filters: DashboardFilters
): MetricData[] => {
  let filtered = [...metrics];

  // if timeRange is not historical, filter metrics accordingly
  if (filters.timeRange !== "historical") {
    const now = new Date();
    const timeRangeMs = {
      "last-minute": 60 * 1000,
      "last-hour": 60 * 60 * 1000,
      "last-day": 24 * 60 * 60 * 1000,
    };

    const cutoffTime = new Date(
      now.getTime() - timeRangeMs[filters.timeRange as keyof typeof timeRangeMs]
    );
    filtered = filtered.filter(
      (metric) => new Date(metric.timestamp) >= cutoffTime
    );
  }

  return filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const useMetricsStore = create<IMetricsStore>((set, get) => ({
  // Initial State
  ...initialStateMetrics,

  // Actions
  addMetrics: (newMetrics: MetricData[]) => {
    set((state) => {
      const existingTimestamps = new Set(state.metrics.map((m) => m.timestamp));
      const uniqueNewMetrics = newMetrics.filter(
        (m) => !existingTimestamps.has(m.timestamp)
      );

      const allMetrics = [...state.metrics, ...uniqueNewMetrics].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      const filteredMetrics = applyFilters(allMetrics, state.filters);

      return {
        metrics: allMetrics,
        filteredMetrics,
        lastUpdated: new Date().toISOString(),
        error: null,
      };
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error, isLoading: false }),

  updateFilters: (newFilters: Partial<DashboardFilters>) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const filteredMetrics = applyFilters(state.metrics, updatedFilters);

      return {
        filters: updatedFilters,
        filteredMetrics,
      };
    }),

  // Computed Getters
  getLatestMetric: () => {
    const { filteredMetrics } = get();
    return filteredMetrics.length > 0 ? filteredMetrics[0] : null;
  },

  getPaginatedMetrics: (page: number, pageSize: number) => {
    const { filteredMetrics } = get();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: filteredMetrics.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredMetrics.length / pageSize),
      totalItems: filteredMetrics.length,
    };
  },
}));
