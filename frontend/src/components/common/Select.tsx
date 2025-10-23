import { useState, useRef, useLayoutEffect, useId } from "react";
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
  disabled?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
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
  disabled = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const comboboxId = useId();

  useOutsideClick(ref, () => {
    setOpen(false);
    setFocusedIndex(-1);
  });

  const base =
    "text-sm rounded px-2 py-1 flex justify-between items-center cursor-pointer transition-all duration-150 select-none w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  const variants: Record<string, string> = {
    default:
      "border border-gray-300 bg-white hover:border-gray-400 focus:ring-1 focus:ring-primary focus:border-primary",
    outlined:
      "border border-gray-400 bg-transparent hover:border-gray-500 focus:ring-1 focus:ring-primary focus:border-primary",
    filled:
      "border border-gray-200 bg-gray-100 hover:border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          handleOptionSelect(options[focusedIndex].value);
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setFocusedIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setFocusedIndex(options.length - 1);
        }
        break;
      default:
        // Type-ahead functionality
        if (event.key.length === 1 && open) {
          const searchChar = event.key.toLowerCase();
          const startIndex = focusedIndex + 1;
          const matchingIndex = options.findIndex(
            (option, index) =>
              index >= startIndex &&
              option.label.toLowerCase().startsWith(searchChar)
          );
          if (matchingIndex !== -1) {
            setFocusedIndex(matchingIndex);
          } else {
            // Search from beginning
            const matchFromStart = options.findIndex((option) =>
              option.label.toLowerCase().startsWith(searchChar)
            );
            if (matchFromStart !== -1) {
              setFocusedIndex(matchFromStart);
            }
          }
        }
        break;
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (disabled) return;
    onChange?.(optionValue);
    setOpen(false);
    setFocusedIndex(-1);
    // Return focus to the combobox
    ref.current?.focus();
  };

  const handleClick = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    if (!open) {
      setFocusedIndex(
        selected ? options.findIndex((o) => o.value === value) : 0
      );
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full sm:w-auto"
      style={{ width, minWidth }}
    >
      {/* Combobox */}
      <div
        id={comboboxId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${base} ${variants[variant]} ${disabledStyles} ${className}`}
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
          aria-hidden="true"
        >
          ▼
        </span>
      </div>

      {/* Listbox */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Options"
          className={`absolute left-0 z-[9999] w-full sm:w-auto bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto transition-all duration-150 ${
            openUpwards ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          style={{ minWidth, width }}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleOptionSelect(option.value)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                option.value === value ? "bg-gray-50 font-medium" : ""
              } ${
                index === focusedIndex ? "bg-blue-50" : ""
              } hover:bg-gray-100`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
