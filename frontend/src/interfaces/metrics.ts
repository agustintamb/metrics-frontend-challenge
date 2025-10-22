export interface RegionMetrics {
  US: number;
  EU: number;
  LATAM: number;
  APAC: number;
}

export interface MetricData {
  timestamp: string;
  activeUsers: number;
  newUsers: number;
  revenue: number;
  churnRate: number;
  byRegion: RegionMetrics;
}

export interface DashboardFilters {
  timeRange: "last-minute" | "last-hour" | "last-day" | "historical";
  metric: "activeUsers" | "revenue" | "churnRate";
  region?: keyof RegionMetrics | "all";
}
