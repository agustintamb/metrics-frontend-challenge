import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { metricConfigs } from "@/constants";
import { formatTime, formatDateTime, tickFormatter } from "@/utils";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface MetricsChartProps {
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export const MetricsChart = ({
  className,
  isLoading,
  error,
}: MetricsChartProps) => {
  const { filteredMetrics, filters } = useMetricsStore();

  const metricConfig =
    metricConfigs[filters.metric] || metricConfigs.activeUsers;

  // Loading state
  if (isLoading && filteredMetrics.length === 0)
    return <ChartSkeleton metricLabel={metricConfig.label.toLowerCase()} />;

  // Error state
  if (error && filteredMetrics.length === 0)
    return <ChartErrorState metricLabel={metricConfig.label.toLowerCase()} />;

  const chartData = filteredMetrics
    .map((metric) => ({
      time: formatTime(metric.timestamp),
      timestamp: metric.timestamp,
      activeUsers: metric.activeUsers,
      revenue: metric.revenue,
      churnRate: metric.churnRate * 100,
      newUsers: metric.newUsers,
    }))
    .reverse();

  // Empty state
  if (chartData.length === 0)
    return <ChartEmptyState metricLabel={metricConfig.label.toLowerCase()} />;

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

  return (
    <div
      className={`bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-200 h-[400px] ${className}`}
    >
      <div className="p-3">
        <h2 className="text-xl font-bold text-gray-900 text-center sm:text-left">
          Evolución de {metricConfig.label.toLowerCase()}
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
              tickFormatter={(value) => tickFormatter(value, metricConfig)}
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

const ChartSkeleton = ({ metricLabel }: { metricLabel: string }) => (
  <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-200 h-[400px]">
    <div className="p-3">
      <h2 className="text-xl font-bold text-gray-900 text-center sm:text-left">
        Evolución de {metricLabel}
      </h2>
    </div>
    <div className="h-80 p-4">
      <div className="h-full bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Cargando gráfico...</div>
      </div>
    </div>
  </div>
);

const ChartErrorState = ({ metricLabel }: { metricLabel: string }) => (
  <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-300 h-[400px]">
    <div className="p-3">
      <h2 className="text-xl font-bold text-gray-900 text-center sm:text-left">
        Evolución de {metricLabel}
      </h2>
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
        <p className="text-gray-500">No se pudo cargar el gráfico</p>
      </div>
    </div>
  </div>
);

const ChartEmptyState = ({ metricLabel }: { metricLabel: string }) => (
  <div className="bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-200 h-[400px]">
    <div className="p-3">
      <h2 className="text-xl font-bold text-gray-900 text-center sm:text-left">
        Evolución de {metricLabel}
      </h2>
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
