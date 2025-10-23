import { formatCurrency, formatNumber } from "@/utils";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const METRICS_COUNT = Number(import.meta.env.VITE_METRICS_COUNT) || 20;
export const POLLING_INTERVAL_MS =
  Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 5000;

export const THRESHOLDS = {
  CHURN_RATE_WARNING: 0.05, // 5%
  CHURN_RATE_CRITICAL: 0.1, // 10%
} as const;

export const ROUTES = {
  DASHBOARD: "/",
} as const;

export const TIME_RANGES = {
  LAST_MINUTE: "last-minute",
  LAST_HOUR: "last-hour",
  LAST_DAY: "last-day",
  HISTORICAL: "historical",
} as const;

export const METRICS_LABELS = {
  activeUsers: "Usuarios Activos",
  newUsers: "Usuarios Nuevos",
  revenue: "Ingresos",
  churnRate: "Tasa de Abandono",
} as const;

export const REGION_LABELS = {
  US: "Estados Unidos",
  EU: "Europa",
  LATAM: "Latinoamérica",
  APAC: "Asia-Pacífico",
} as const;

export const FILTER_OPTIONS = {
  TIME_RANGES: [
    { value: "last-minute", label: "Último minuto" },
    { value: "last-hour", label: "Última hora" },
    { value: "last-day", label: "Último día" },
    { value: "historical", label: "Histórico" },
  ],
  METRICS: [
    { value: "activeUsers", label: "Usuarios Activos" },
    { value: "revenue", label: "Ingresos" },
    { value: "churnRate", label: "Tasa de Abandono" },
  ],
  REGIONS: [
    { value: "all", label: "Global" },
    { value: "US", label: "Estados Unidos" },
    { value: "EU", label: "Europa" },
    { value: "LATAM", label: "Latinoamérica" },
    { value: "APAC", label: "Asia-Pacífico" },
  ],
} as const;

// Determine which metric to display based on the selected filter
export const metricConfigs = {
  activeUsers: {
    key: "activeUsers",
    label: METRICS_LABELS.activeUsers,
    color: "#6366f1",
    gradientColors: ["#6366f1", "#8b5cf6"],
    formatter: formatNumber,
  },
  revenue: {
    key: "revenue",
    label: METRICS_LABELS.revenue,
    color: "#059669",
    gradientColors: ["#059669", "#10b981"],
    formatter: formatCurrency,
  },
  churnRate: {
    key: "churnRate",
    label: METRICS_LABELS.churnRate,
    color: "#dc2626",
    gradientColors: ["#dc2626", "#ef4444"],
    formatter: (value: number) => `${value.toFixed(2)}%`,
  },
} as const;
