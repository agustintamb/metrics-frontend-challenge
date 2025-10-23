import { metricConfigs } from "@/constants";

/** Formats currency in ARS  */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

/** Formats number with thousands separators */
export const formatNumber = (num: number): string =>
  new Intl.NumberFormat("es-AR").format(num);

/** Formats a decimal number as percentage */
export const formatPercentage = (value: number): string =>
  `${(value * 100).toFixed(2)} %`;

/** Formats date and time */
export const formatDateTime = (timestamp: string): string =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));

/** Formats time only */
export const formatTime = (timestamp: string): string =>
  new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));

/** Calculates the trend between two values */
export const calculateTrend = (
  current: number,
  previous?: number
): "up" | "down" | "neutral" => {
  if (previous === undefined) return "neutral";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "neutral";
};

export const tickFormatter = (
  value: number,
  metricConfig: (typeof metricConfigs)[keyof typeof metricConfigs]
) => {
  if (metricConfig.key === "revenue") return `${formatNumber(value / 1000)}K`;
  if (metricConfig.key === "churnRate") return `${value.toFixed(1)}%`;
  return formatNumber(value);
};

/** Debounce function */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/** Class names concatenation helper */
export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");

/** Helper to handle fetch responses */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
