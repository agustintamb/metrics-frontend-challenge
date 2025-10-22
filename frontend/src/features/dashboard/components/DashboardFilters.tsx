import { useState } from "react";
import { Calendar, BarChart3, Globe, Filter, X } from "lucide-react";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { DashboardFilters as FiltersType } from "@/interfaces/metrics";
import { FILTER_OPTIONS } from "@/constants";
import { Select } from "@/components/common/Select";
import { useScreenSize } from "@/hooks/useScreenSize";

export const DashboardFilters = () => {
  const { filters, updateFilters } = useMetricsStore();
  const { isMobile } = useScreenSize();
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleChange = (key: keyof FiltersType, val: string) =>
    setTempFilters((prev) => ({ ...prev, [key]: val }));

  const applyFilters = () => {
    updateFilters(tempFilters);
    setOpen(false);
  };

  const FiltersContent = (isTemporary = false) => (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center p-3 overflow-visible">
      {/* Time Range filter */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Calendar className="w-4 h-4 text-gray-500" />
        <Select
          value={
            (isTemporary ? tempFilters.timeRange : filters.timeRange) || ""
          }
          onChange={(val: string) =>
            isTemporary
              ? handleChange("timeRange", val)
              : updateFilters({ timeRange: val as FiltersType["timeRange"] })
          }
          options={FILTER_OPTIONS.TIME_RANGES}
          variant="outlined"
          className="flex-1"
        />
      </div>

      {/* Metric type filter */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <BarChart3 className="w-4 h-4 text-gray-500" />
        <Select
          value={(isTemporary ? tempFilters.metric : filters.metric) || ""}
          onChange={(val: string) =>
            isTemporary
              ? handleChange("metric", val)
              : updateFilters({ metric: val as FiltersType["metric"] })
          }
          options={FILTER_OPTIONS.METRICS}
          variant="outlined"
          className="flex-1"
        />
      </div>

      {/* Region filter */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Globe className="w-4 h-4 text-gray-500" />
        <Select
          value={(isTemporary ? tempFilters.region : filters.region) || "all"}
          onChange={(val: string) =>
            isTemporary
              ? handleChange("region", val)
              : updateFilters({
                  region:
                    val === "all" ? "all" : (val as FiltersType["region"]),
                })
          }
          options={FILTER_OPTIONS.REGIONS}
          variant="outlined"
          className="flex-1"
        />
      </div>
    </div>
  );

  // on desktop
  if (!isMobile)
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible">
        {FiltersContent(false)}
      </div>
    );

  // on mobile
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          setTempFilters(filters); // reset temporary values
          setOpen(true);
        }}
        className="fixed bottom-5 right-5 z-50 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-all"
        title="Filtros"
      >
        <Filter className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          style={{ marginTop: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center"
        >
          {/* Bottom Sheet */}
          <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-xl shadow-lg max-h-[90vh] overflow-visible animate-slide-up relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-visible">{FiltersContent(true)}</div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={applyFilters}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
