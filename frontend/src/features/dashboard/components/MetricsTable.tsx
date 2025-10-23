import { useState } from "react";
import { Table, TableColumn } from "@/components/common/Table";
import { useMetricsStore } from "@/stores/metrics/useMetricsStore";
import { THRESHOLDS } from "@/constants";
import {
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatPercentage,
} from "@/utils";

interface MetricsTableProps {
  isLoading?: boolean;
  error?: Error | null;
}

export const MetricsTable = ({ isLoading, error }: MetricsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);

  const { getPaginatedMetrics } = useMetricsStore();
  const {
    data: tableData,
    totalPages,
    totalItems,
  } = getPaginatedMetrics(currentPage, pageSize);

  const columns: TableColumn<(typeof tableData)[number]>[] = [
    {
      key: "timestamp",
      label: "Fecha y Hora",
      minWidth: "180px",
      render: (m) => (
        <div className="text-sm font-medium text-gray-900">
          {formatDateTime(m.timestamp)}
        </div>
      ),
    },
    {
      key: "activeUsers",
      label: "Usuarios Activos",
      minWidth: "120px",
      render: (m) => (
        <div className="text-sm font-semibold text-gray-900">
          {formatNumber(m.activeUsers)}
        </div>
      ),
    },
    {
      key: "newUsers",
      label: "Usuarios Nuevos",
      minWidth: "120px",
      render: (m) => (
        <div className="text-sm font-semibold text-gray-900">
          {formatNumber(m.newUsers)}
        </div>
      ),
    },
    {
      key: "revenue",
      label: "Ingresos",
      minWidth: "140px",
      render: (m) => (
        <div className="text-sm font-semibold text-gray-900">
          {formatCurrency(m.revenue)}
        </div>
      ),
    },
    {
      key: "churnRate",
      label: "Tasa de Abandono",
      minWidth: "120px",
      render: (m) => {
        const isHigh = m.churnRate > THRESHOLDS.CHURN_RATE_WARNING;
        return (
          <div
            className={`text-sm font-bold ${
              isHigh ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formatPercentage(m.churnRate)}
          </div>
        );
      },
    },
  ];

  const handleSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <Table
      columns={columns}
      data={tableData}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={handleSizeChange}
      loadingRowsCount={4}
      showPagination
      isLoading={isLoading}
      error={error}
    />
  );
};
