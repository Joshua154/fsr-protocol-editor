import { useCallback, useMemo, useState } from "react";

type Options<T> = {
  isOpen: boolean;
  matches: T[];
  onPick: (item: T) => void;
  onClose?: () => void;
};

export function useSuggestionNavigation<T>({
  isOpen,
  matches,
  onPick,
  onClose,
}: Options<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const clampedActiveIndex = useMemo(() => {
    if (matches.length === 0) return 0;
    return Math.min(activeIndex, matches.length - 1);
  }, [activeIndex, matches.length]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return false;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (matches.length === 0) return true;
        setActiveIndex((idx) => (idx + 1) % matches.length);
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (matches.length === 0) return true;
        setActiveIndex((idx) => (idx - 1 + matches.length) % matches.length);
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        if (matches.length === 0) return false;
        e.preventDefault();
        const target = matches[Math.max(0, clampedActiveIndex)]!;
        onPick(target);
        return true;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return true;
      }

      return false;
    },
    [isOpen, matches, clampedActiveIndex, onPick, onClose],
  );

  return { activeIndex: clampedActiveIndex, setActiveIndex, onKeyDown };
}
