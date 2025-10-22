import { Users, UserPlus, DollarSign, TrendingDown } from "lucide-react";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { THRESHOLDS, REGION_LABELS } from "@/constants";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateTrend,
} from "@/utils";

interface DashboardKPIsProps {
  className?: string;
}

export const DashboardKPIs = ({ className }: DashboardKPIsProps) => {
  const { getLatestMetric, filteredMetrics, filters } = useMetricsStore();

  const latestMetric = getLatestMetric();

  if (!latestMetric) {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  const previousMetric = filteredMetrics.length > 1 ? filteredMetrics[1] : null;

  const getTrendIcon = (current: number, previous: number | undefined) => {
    const trend = calculateTrend(current, previous);

    if (trend === "neutral")
      return (
        <svg
          className="w-3 h-3 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
        </svg>
      );

    const isUp = trend === "up";
    return (
      <svg
        className={`w-3 h-3 ${isUp ? "text-green-500" : "text-red-500"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d={
            isUp
              ? "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              : "M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          }
        />
      </svg>
    );
  };

  const getActiveUsersValue = () => {
    if (filters.region && filters.region !== "all") {
      return latestMetric.byRegion[
        filters.region as keyof typeof REGION_LABELS
      ];
    }
    return latestMetric.activeUsers;
  };

  const isChurnAlert = latestMetric.churnRate > THRESHOLDS.CHURN_RATE_WARNING;

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-600">
              Usuarios activos
            </span>
          </div>
          {getTrendIcon(getActiveUsersValue(), previousMetric?.activeUsers)}
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {formatNumber(getActiveUsersValue())}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
        className={`p-4 rounded-lg shadow-sm border transition-shadow hover:shadow-md ${
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
              Tasa de abandono
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
