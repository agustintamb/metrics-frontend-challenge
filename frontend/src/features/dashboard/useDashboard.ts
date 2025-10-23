import { useEffect } from "react";
import { POLLING_INTERVAL_MS, METRICS_COUNT } from "@/constants";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { metricsService } from "@/services/api";
import { useDataFetch } from "@/hooks/useDataFetch";

export const useDashboard = () => {
  const { addMetrics } = useMetricsStore();

  const { data, isLoading, error, isError, refetch, isFetching } = useDataFetch(
    {
      queryKey: ["metrics"],
      queryFn: () => metricsService.getMetrics(METRICS_COUNT),
      refetchInterval: POLLING_INTERVAL_MS,
      refetchIntervalInBackground: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(3000 * 2 ** attemptIndex, 60000),
    }
  );

  // new data is fetched -> adds it to the store
  useEffect(() => {
    if (data && data.length > 0) addMetrics(data);
  }, [data, addMetrics]);

  return {
    data,
    isLoading,
    error,
    isError,
    refetch,
    isFetching,
  };
};
