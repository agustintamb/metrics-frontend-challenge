import { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        onOutsideClick();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onOutsideClick]);
};
