import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton = ({ className, width, height }: SkeletonProps) => {
  return (
    <div
      className={cn("animate-pulse bg-gray-200 rounded", className)}
      style={{ width, height }}
    />
  );
};

export const MetricCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <Skeleton className="h-6 w-48 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-end space-x-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton
              className={`w-4 h-${12 + Math.floor(Math.random() * 20)}`}
            />
            <Skeleton
              className={`w-4 h-${8 + Math.floor(Math.random() * 24)}`}
            />
            <Skeleton
              className={`w-4 h-${16 + Math.floor(Math.random() * 16)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart */}
      <ChartSkeleton />
    </div>
  );
};
