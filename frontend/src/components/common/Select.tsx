import { useState, useRef, useLayoutEffect } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  variant?: "default" | "outlined" | "filled";
  minWidth?: string;
  width?: string;
  placeholder?: string;
  className?: string;
}

export const Select = ({
  value,
  onChange,
  options,
  variant = "default",
  minWidth = "150px",
  width = "100%",
  placeholder = "Seleccionar...",
  className = "",
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setOpen(false));

  const base =
    "text-sm rounded px-2 py-1 flex justify-between items-center cursor-pointer transition-all duration-150 select-none w-full sm:w-auto";
  const variants: Record<string, string> = {
    default:
      "border border-gray-300 bg-white hover:border-gray-400 focus:ring-1 focus:ring-primary focus:border-primary",
    outlined:
      "border border-gray-400 bg-transparent hover:border-gray-500 focus:ring-1 focus:ring-primary focus:border-primary",
    filled:
      "border border-gray-200 bg-gray-100 hover:border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary",
  };

  const selected = options.find((o) => o.value === value);

  // Checks available space to open the menu upwards or downwards
  useLayoutEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = Math.min(options.length * 36, 240);
      setOpenUpwards(spaceBelow < menuHeight);
    }
  }, [open, options.length]);

  return (
    <div
      ref={ref}
      className="relative w-full sm:w-auto"
      style={{ width, minWidth }}
    >
      {/* Display */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`${base} ${variants[variant]} ${className}`}
      >
        <span className="truncate">
          {selected ? (
            selected.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <span
          className={`ml-2 text-gray-500 text-xs transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </div>

      {/* Menu */}
      {open && (
        <div
          className={`absolute left-0 z-[9999] w-full sm:w-auto bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto transition-all duration-150 ${
            openUpwards ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{ minWidth, width }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                option.value === value ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
