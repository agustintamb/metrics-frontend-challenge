import { API_BASE_URL } from "@/constants";
import { MetricData } from "@/interfaces/metrics";
import { handleResponse } from "@/utils";

// Metrics Service
export const metricsService = {
  getMetrics: async (count?: number): Promise<MetricData[]> => {
    const url = new URL(`${API_BASE_URL}/metrics`);
    if (count) url.searchParams.set("count", count.toString());
    const response = await fetch(url);
    return handleResponse(response);
  },
};
