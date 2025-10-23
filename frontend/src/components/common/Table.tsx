import { ReactNode } from "react";
import { Pagination } from "./Pagination";

export interface TableColumn<T> {
  key: string;
  label: string;
  minWidth?: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  maxHeight?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPagination?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  loadingRowsCount?: number;
}

const TableSkeleton = ({
  columns,
  rowsCount = 5,
  minHeight,
  maxHeight,
}: {
  columns: TableColumn<any>[];
  rowsCount?: number;
  minHeight: string;
  maxHeight: string;
}) => (
  <div className="overflow-x-auto flex-1">
    <div
      style={{
        minHeight,
        maxHeight,
      }}
      className="overflow-y-auto"
    >
      <table className="w-full border-collapse min-w-[600px]">
        <thead className="bg-gradient-to-r from-primary to-primary-light text-white sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rowsCount }).map((_, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((_, j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TableErrorState = ({
  columns,
  minHeight,
  maxHeight,
}: {
  columns: TableColumn<any>[];
  minHeight: string;
  maxHeight: string;
}) => (
  <div className="overflow-x-auto flex-1">
    <div
      style={{
        minHeight,
        maxHeight,
      }}
      className="overflow-y-auto"
    >
      <table className="w-full border-collapse min-w-[600px]">
        <thead className="bg-gradient-to-r from-primary to-primary-light text-white sticky top-0 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-8 text-center text-gray-500"
            >
              Error al cargar los datos
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const Table = <T,>({
  columns,
  data,
  className = "",
  maxHeight,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 200,
  onPageChange,
  onPageSizeChange,
  showPagination = false,
  isLoading = false,
  error = null,
  loadingRowsCount = 4,
}: TableProps<T>) => {
  const rowHeight = 50;
  const minTableHeight = rowHeight * 5;
  const maxTableHeight = rowHeight * 5;
  const tableMaxHeight = maxHeight || `${maxTableHeight}px`;
  const tableMinHeight = `${minTableHeight}px`;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border ${
        error && data.length === 0 ? "border-gray-300" : "border-gray-200"
      } flex flex-col ${className}`}
    >
      {/* Loading and error states when there's no data */}
      {isLoading && data.length === 0 ? (
        <TableSkeleton
          columns={columns}
          rowsCount={loadingRowsCount}
          minHeight={tableMinHeight}
          maxHeight={tableMaxHeight}
        />
      ) : error && data.length === 0 ? (
        <TableErrorState
          columns={columns}
          minHeight={tableMinHeight}
          maxHeight={tableMaxHeight}
        />
      ) : (
        /* Table content */
        <div className="overflow-x-auto flex-1">
          <div
            className="overflow-y-auto"
            style={{
              minHeight: tableMinHeight,
              maxHeight: tableMaxHeight,
            }}
          >
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gradient-to-r from-primary to-primary-light text-white sticky top-0 z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={
                        col.minWidth ? { minWidth: col.minWidth } : undefined
                      }
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr
                      key={`${rowIndex}-${(item as any).id || rowIndex}`}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-primary/5 transition-colors duration-200`}
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={`${rowIndex}-${colIndex}-${col.key}`}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {col.render
                            ? col.render(item)
                            : (item as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      "No hay resultados para mostrar"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination is shown when there are multiple pages of data */}
      {showPagination &&
        onPageChange &&
        onPageSizeChange &&
        !isLoading &&
        !error && (
          <div className="border-t border-gray-200 px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
    </div>
  );
};
