import { Users, UserPlus, DollarSign, TrendingDown } from "lucide-react";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { TrendArrowIcon } from "@/assets/TrendArrowIcon";
import { TrendNeutralIcon } from "@/assets/TrendNeutralIcon";
import { THRESHOLDS, REGION_LABELS } from "@/constants";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateTrend,
} from "@/utils";

interface DashboardKPIsProps {
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
}

const getTrendIcon = (current: number, previous: number | undefined) => {
  const trend = calculateTrend(current, previous);
  const isNeutral = trend === "neutral";

  if (isNeutral) return <TrendNeutralIcon />;
  return <TrendArrowIcon isUp={trend === "up"} />;
};

export const DashboardKPIs = ({
  className,
  isLoading,
  error,
}: DashboardKPIsProps) => {
  const { getLatestMetric, filteredMetrics, filters } = useMetricsStore();
  const latestMetric = getLatestMetric();

  if (isLoading && !latestMetric) return <KPISkeleton />;
  if (error && !latestMetric) return <KPIErrorState />;
  if (!latestMetric) return <KPIEmptyState />;

  const getActiveUsersValue = () => {
    if (filters.region && filters.region !== "all")
      return latestMetric.byRegion[
        filters.region as keyof typeof REGION_LABELS
      ];
    return latestMetric.activeUsers;
  };

  const activeUsers = getActiveUsersValue();
  const isChurnAlert = latestMetric.churnRate > THRESHOLDS.CHURN_RATE_WARNING;
  const previousMetric = filteredMetrics.length > 1 ? filteredMetrics[1] : null;

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-[88px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-600">
              Usuarios activos
            </span>
          </div>
          {getTrendIcon(activeUsers, previousMetric?.activeUsers)}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatNumber(activeUsers)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-[88px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-green-600" />
            <span className="text-xs font-medium text-gray-600">
              Usuarios nuevos
            </span>
          </div>
          {getTrendIcon(latestMetric.newUsers, previousMetric?.newUsers)}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatNumber(latestMetric.newUsers)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-[88px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-600" />
            <span className="text-xs font-medium text-gray-600">Ingresos</span>
          </div>
          {getTrendIcon(latestMetric.revenue, previousMetric?.revenue)}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(latestMetric.revenue)}
        </div>
      </div>

      <div
        className={`p-4 rounded-lg shadow-sm border transition-shadow hover:shadow-md h-[88px] ${
          isChurnAlert ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingDown
              size={16}
              className={isChurnAlert ? "text-red-600" : "text-orange-600"}
            />
            <span
              className={`text-xs font-medium ${
                isChurnAlert ? "text-red-700" : "text-gray-600"
              }`}
            >
              Tasa abandono
            </span>
          </div>
          {getTrendIcon(latestMetric.churnRate, previousMetric?.churnRate)}
        </div>
        <div
          className={`text-2xl font-bold ${
            isChurnAlert ? "text-red-800" : "text-gray-900"
          }`}
        >
          {formatPercentage(latestMetric.churnRate)}
        </div>
      </div>
    </div>
  );
};

const KPISkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[88px]"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
      </div>
    ))}
  </div>
);

const KPIErrorState = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 h-[88px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">--</span>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="text-2xl font-bold text-gray-500">--</div>
      </div>
    ))}
  </div>
);

const KPIEmptyState = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-[88px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400">--</span>
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
        </div>
        <div className="text-2xl font-bold text-gray-400">--</div>
      </div>
    ))}
  </div>
);
