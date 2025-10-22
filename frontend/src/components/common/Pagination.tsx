import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/utils";
import { Select } from "@/components/common/Select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  className,
}: PaginationProps) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageSizeOptions = [5, 20, 100, 200, 500].map((size) => ({
    value: size.toString(),
    label: size.toString(),
  }));

  const getPageRange = () => {
    const maxButtons = 5;
    const pages: (number | string)[] = [];
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);
    if (currentPage <= half) end = Math.min(totalPages, maxButtons);
    if (currentPage + half > totalPages)
      start = Math.max(1, totalPages - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (start > 1) pages.unshift("...");
    if (end < totalPages) pages.push("...");
    return pages;
  };

  const pageNumbers = getPageRange();

  const buttonBase =
    "flex items-center justify-center w-8 h-8 text-sm font-medium transition-colors rounded-lg border shrink-0";
  const activeButton =
    "bg-primary text-white border-primary hover:bg-primary-dark";
  const inactiveButton =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
  const disabledButton =
    "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed";

  if (totalPages <= 1 && !showPageSizeSelector) return null;

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between gap-3 w-full",
        className
      )}
    >
      {/* Item Range and Page Size Selector */}
      <div className="flex items-center gap-3 text-sm text-gray-700 justify-center md:justify-start">
        <span>
          {startItem}-{endItem} de {totalItems} elementos
        </span>

        {showPageSizeSelector && onPageSizeChange && (
          <Select
            value={pageSize.toString()}
            onChange={(val) => onPageSizeChange(Number(val))}
            options={pageSizeOptions}
            variant="outlined"
            minWidth="90px"
            width="90px"
          />
        )}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 h-12 overflow-x-auto px-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={cn(
              buttonBase,
              currentPage === 1 ? disabledButton : inactiveButton
            )}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              buttonBase,
              currentPage === 1 ? disabledButton : inactiveButton
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((num, i) =>
            num === "..." ? (
              <span
                key={i}
                className="w-8 h-8 flex items-center justify-center text-gray-400 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => onPageChange(num as number)}
                className={cn(
                  buttonBase,
                  num === currentPage ? activeButton : inactiveButton
                )}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              buttonBase,
              currentPage === totalPages ? disabledButton : inactiveButton
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={cn(
              buttonBase,
              currentPage === totalPages ? disabledButton : inactiveButton
            )}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
