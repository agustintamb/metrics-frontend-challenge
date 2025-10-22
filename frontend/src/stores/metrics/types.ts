import { DashboardFilters, MetricData } from "@/interfaces/metrics";

export interface IMetricsState {
  metrics: MetricData[];
  filteredMetrics: MetricData[];
  filters: DashboardFilters;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface IMetricsActions {
  addMetrics: (newMetrics: MetricData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  getLatestMetric: () => MetricData | null;
  getPaginatedMetrics: (
    page: number,
    pageSize: number
  ) => {
    data: MetricData[];
    totalPages: number;
    totalItems: number;
  };
}

// Combined type for the store and actions
export type MetricsStoreType = IMetricsState & IMetricsActions;

export interface IMetricsStore extends MetricsStoreType {}
