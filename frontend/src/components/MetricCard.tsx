import { cn } from "@/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  isAlert?: boolean;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export const MetricCard = ({
  title,
  value,
  isAlert = false,
  icon,
  className,
  trend,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (!trend || trend === "neutral") return null;

    return (
      <div
        className={cn(
          "inline-flex items-center ml-2",
          trend === "up" ? "text-green-600" : "text-red-600"
        )}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {trend === "up" ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        isAlert
          ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
          : "border-gray-200 hover:border-primary hover:shadow-primary/10",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            isAlert ? "text-red-700" : "text-gray-600"
          )}
        >
          {title}
        </h3>

        {icon && (
          <div
            className={cn(
              "p-3 rounded-lg",
              isAlert
                ? "bg-red-100 text-red-600"
                : "bg-gradient-to-br from-primary to-primary-light text-white shadow-lg"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline min-h-[2.5rem]">
        <p
          className={cn(
            "text-3xl font-bold",
            isAlert ? "text-red-800" : "text-gray-900"
          )}
        >
          {value}
        </p>
        {getTrendIcon()}
      </div>
    </div>
  );
};
