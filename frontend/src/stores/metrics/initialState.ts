import { IMetricsState } from "./types";

export const initialStateMetrics: IMetricsState = {
  metrics: [],
  filteredMetrics: [],
  filters: {
    timeRange: "historical",
    metric: "activeUsers",
    region: "all",
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};
