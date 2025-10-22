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
  emptyState?: ReactNode;
}

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
  emptyState,
}: TableProps<T>) => {
  const rowHeight = 48; // px, ajustable según padding/line-height
  const minTableHeight = rowHeight * 5;
  const maxTableHeight = rowHeight * 5;
  const tableMaxHeight = maxHeight || `${maxTableHeight}px`;
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col ${className}`}
    >
      {/* Contenedor de tabla con scroll interno */}
      <div className="overflow-x-auto flex-1">
        <div
          style={{
            minHeight: `${minTableHeight}px`,
            maxHeight: tableMaxHeight,
          }}
          className="overflow-y-auto"
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
                        {col.render ? col.render(item) : (item as any)[col.key]}
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
                    {emptyState || "No hay resultados para mostrar"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && onPageChange && onPageSizeChange && (
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
