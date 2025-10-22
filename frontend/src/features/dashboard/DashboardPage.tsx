import { useMetrics } from "@/hooks/useMetrics";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { formatDateTime } from "@/utils";
import { POLLING_INTERVAL_MS } from "@/constants";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { DashboardKPIs } from "./components/DashboardKPIs";
import { DashboardFilters } from "./components/DashboardFilters";
import { MetricsTable } from "./components/MetricsTable";
import { MetricsChart } from "./components/MetricsChart";

export const DashboardPage = () => {
  const { isLoading, error, refetch } = useMetrics();
  const { getLatestMetric } = useMetricsStore();

  const pollingIntervalSeconds = POLLING_INTERVAL_MS / 1000;
  const latestMetric = getLatestMetric();

  // Loading state
  if (isLoading && !latestMetric) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Dashboard de Métricas
          </h1>
          {latestMetric && (
            <p className="text-sm text-gray-600">
              Última actualización: {formatDateTime(latestMetric.timestamp)}
              <span className="ml-2 inline-flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                En vivo
              </span>
            </p>
          )}
        </div>

        <DashboardKPIs />
        <DashboardFilters />
        <MetricsChart />
        <MetricsTable />

        <div className="text-center text-xs text-gray-500 py-2">
          Actualización automática cada {pollingIntervalSeconds} segundos
        </div>
      </div>
    </div>
  );
};
