import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  formatTime,
  formatCurrency,
  formatNumber,
  formatDateTime,
} from "@/utils";
import { METRICS_LABELS } from "@/constants";

interface MetricsChartProps {
  className?: string;
}

export const MetricsChart = ({ className }: MetricsChartProps) => {
  const { filteredMetrics, filters } = useMetricsStore();

  const chartData = filteredMetrics
    .map((metric) => ({
      time: formatTime(metric.timestamp), // We show by minute cause metrics are frequent
      timestamp: metric.timestamp,
      activeUsers: metric.activeUsers,
      revenue: metric.revenue,
      churnRate: metric.churnRate * 100, // converts to percentage
      newUsers: metric.newUsers,
    }))
    .reverse();

  // Determine which metric to display based on the selected filter
  const getMetricConfig = () => {
    switch (filters.metric) {
      case "activeUsers":
        return {
          key: "activeUsers",
          label: METRICS_LABELS.activeUsers,
          color: "#6366f1",
          gradientColors: ["#6366f1", "#8b5cf6"],
          formatter: formatNumber,
        };
      case "revenue":
        return {
          key: "revenue",
          label: METRICS_LABELS.revenue,
          color: "#059669",
          gradientColors: ["#059669", "#10b981"],
          formatter: formatCurrency,
        };
      case "churnRate":
        return {
          key: "churnRate",
          label: METRICS_LABELS.churnRate,
          color: "#dc2626",
          gradientColors: ["#dc2626", "#ef4444"],
          formatter: (value: number) => `${value.toFixed(2)}%`,
        };
      default:
        // If no match, default to activeUsers
        return {
          key: "activeUsers",
          label: METRICS_LABELS.activeUsers,
          color: "#6366f1",
          gradientColors: ["#6366f1", "#8b5cf6"],
          formatter: formatNumber,
        };
    }
  };

  const metricConfig = getMetricConfig();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {formatDateTime(data.payload.timestamp)}
          </p>
          <p className="text-sm font-semibold" style={{ color: data.color }}>
            {metricConfig.label}: {metricConfig.formatter(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div
        className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Evolución de {metricConfig.label}
          </h2>
          <p className="text-sm text-gray-600">
            No hay datos suficientes para mostrar el gráfico
          </p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600">No hay datos para mostrar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      <div className="p-3">
        <h2 className="text-xl font-bold text-gray-900">
          Evolución de {metricConfig.label}
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: -5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={metricConfig.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={metricConfig.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="time"
              stroke="#9ca3af"
              fontSize={12}
              axisLine={false}
            />

            <YAxis
              orientation="right"
              stroke="#9ca3af"
              fontSize={12}
              axisLine={false}
              tickFormatter={(value) => {
                if (metricConfig.key === "revenue")
                  return `${formatNumber(value / 1000)}K`;
                if (metricConfig.key === "churnRate")
                  return `${value.toFixed(1)}%`;
                return formatNumber(value);
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={metricConfig.key}
              stroke={metricConfig.color}
              fill="url(#colorGradient)"
              dot={{ fill: metricConfig.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: metricConfig.color, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
