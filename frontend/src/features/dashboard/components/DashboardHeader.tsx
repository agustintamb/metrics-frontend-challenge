import { MetricData } from "@/interfaces/metrics";
import { formatDateTime } from "@/utils";

interface DashboardHeaderProps {
  latestMetric: MetricData | null;
  isLoading: boolean;
  isError: boolean;
}

export const DashboardHeader = ({
  latestMetric,
  isLoading,
  isError,
}: DashboardHeaderProps) => (
  <div className="text-center">
    <div className="flex justify-center gap-2 mt-4">
      <h1 className="text-2xl font-bold text-gray-900">
        Dashboard de métricas
      </h1>
      <div
        className={`w-3 h-3 mt-3 rounded-full ${
          isLoading
            ? "bg-gray-400"
            : isError
            ? "bg-red-500"
            : "bg-green-500 animate-pulse"
        }`}
      ></div>
    </div>
    <div className="h-5">
      {latestMetric ? (
        <p className="text-sm text-gray-600">
          Última actualización: {formatDateTime(latestMetric.timestamp)}
        </p>
      ) : null}
    </div>
  </div>
);
