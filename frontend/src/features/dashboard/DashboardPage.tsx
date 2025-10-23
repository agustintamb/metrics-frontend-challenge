import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { POLLING_INTERVAL_MS } from "@/constants";
import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardKPIs } from "./components/DashboardKPIs";
import { DashboardFilters } from "./components/DashboardFilters";
import { MetricsTable } from "./components/MetricsTable";
import { MetricsChart } from "./components/MetricsChart";
import { useDashboard } from "./useDashboard";

export const DashboardPage = () => {
  const { getLatestMetric } = useMetricsStore();
  const { isLoading, error, isError } = useDashboard();

  const pollingIntervalSeconds = POLLING_INTERVAL_MS / 1000;
  const latestMetric = getLatestMetric();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      <div className="p-4 space-y-4 max-w-7xl mx-auto">
        <DashboardHeader
          latestMetric={latestMetric}
          isLoading={isLoading}
          isError={isError}
        />
        <DashboardKPIs isLoading={isLoading} error={error} />
        <DashboardFilters />
        <MetricsChart isLoading={isLoading} error={error} />
        <MetricsTable isLoading={isLoading} error={error} />
        <div className="text-center text-xs text-gray-500 py-2">
          Actualización automática cada {pollingIntervalSeconds} segundos
        </div>
      </div>
    </div>
  );
};
