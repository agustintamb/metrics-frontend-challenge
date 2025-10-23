import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { MetricData } from "@/interfaces/metrics";

// Mock data factory
export const createMockMetric = (
  overrides: Partial<MetricData> = {}
): MetricData => ({
  timestamp: "2025-10-23T10:00:00.000Z",
  activeUsers: 1000,
  newUsers: 50,
  revenue: 5000,
  churnRate: 0.05,
  byRegion: {
    US: 400,
    EU: 300,
    LATAM: 200,
    APAC: 100,
  },
  ...overrides,
});

// Generate multiple mock metrics
export const createMockMetrics = (count: number): MetricData[] => {
  return Array.from({ length: count }, (_, index) => {
    const timestamp = new Date(Date.now() - index * 60000).toISOString();
    return createMockMetric({
      timestamp,
      activeUsers: 1000 + Math.floor(Math.random() * 500),
      newUsers: 20 + Math.floor(Math.random() * 80),
      revenue: 4000 + Math.floor(Math.random() * 3000),
      churnRate: 0.02 + Math.random() * 0.08,
    });
  });
};

// Create a test query client
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock fetch responses
export const mockFetchSuccess = (data: any) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(data),
  } as any);
};

export const mockFetchError = (status: number = 500) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: vi.fn().mockResolvedValue({ message: "Error" }),
  } as any);
};

// Wait for async operations
export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));
