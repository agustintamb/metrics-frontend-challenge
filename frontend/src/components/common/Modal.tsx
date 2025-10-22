import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  size = "md",
}: ModalProps) => {
  if (!open) return null;

  const widthClasses =
    size === "sm"
      ? "sm:w-[360px]"
      : size === "lg"
      ? "sm:w-[600px]"
      : "sm:w-[450px]";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div
        className={cn(
          "bg-white w-full rounded-t-2xl sm:rounded-xl shadow-lg max-h-[90vh] overflow-visible animate-slide-up relative",
          widthClasses,
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-visible">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-200 flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
