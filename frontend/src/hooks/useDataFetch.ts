import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface UseDataFetchOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  pollingInterval?: number;
}

export const useDataFetch = <T>({
  queryKey,
  queryFn,
  pollingInterval,
  retry = 3,
  retryDelay = (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  ...options
}: UseDataFetchOptions<T>) => {
  const query = useQuery({
    queryKey,
    queryFn,
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: !!pollingInterval,
    retry,
    retryDelay,
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error ? new Error(query.error.message) : null,
    isError: !!query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
  };
};
