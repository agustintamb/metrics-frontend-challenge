import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { metricsService } from "@/services/api";
import { POLLING_INTERVAL_MS, METRICS_COUNT } from "@/constants";

export const useMetrics = () => {
  const { addMetrics, setLoading, setError, isLoading, error } =
    useMetricsStore();

  const query = useQuery({
    refetchInterval: POLLING_INTERVAL_MS,
    refetchIntervalInBackground: true,
    retry: 3,
    queryKey: ["metrics"],
    queryFn: () => metricsService.getMetrics(METRICS_COUNT),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle loading state
  useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  // Handle errors
  useEffect(() => {
    if (query.error) setError(query.error.message);
    else setError(null);
  }, [query.error, setError]);

  // When new data is fetched, add it to the store
  useEffect(() => {
    if (query.data && query.data.length > 0) addMetrics(query.data);
  }, [query.data, addMetrics]);

  return {
    data: query.data,
    isLoading,
    error: error ? new Error(error) : null,
    isError: !!error,
    refetch: query.refetch,
  };
};
