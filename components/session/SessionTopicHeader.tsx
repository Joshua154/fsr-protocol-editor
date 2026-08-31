import React from "react";
import { GripVertical, ListChecks, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

type Props = {
  value: string;
  position: number;
  pointCount: number;
  topicRef: React.RefObject<HTMLInputElement | null>;
  dragHandleProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onChange: (element: HTMLInputElement, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onBlur: () => void;
  onRemove: () => void;
};

export function SessionTopicHeader({
  value,
  position,
  pointCount,
  topicRef,
  dragHandleProps,
  onChange,
  onKeyDown,
  onBlur,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-[color:var(--muted)]/45 p-3 sm:gap-3 sm:px-4">
      <button
        type="button"
        {...dragHandleProps}
        className="focus-ring flex h-11 w-9 shrink-0 touch-none cursor-grab items-center justify-center rounded-xl border border-border bg-[color:var(--card-strong)]/55 text-muted-foreground shadow-sm transition-[color,background-color,border-color,transform] hover:border-[var(--border-strong)] hover:bg-[var(--card-strong)] hover:text-primary active:scale-95 active:cursor-grabbing"
        aria-label="Thema verschieben"
        title="Ziehen zum Sortieren"
      >
        <GripVertical size={18} />
      </button>

      <input
        ref={topicRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.currentTarget, event.target.value)}
        className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2 text-base font-bold tracking-[-0.02em] text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-[color:var(--input)]/50 focus:border-primary focus:bg-[var(--card-strong)] sm:text-lg"
        placeholder="Thema benennen ..."
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />

      <Button
        onClick={onRemove}
        variant="quiet"
        size="icon"
        className="shrink-0 text-muted-foreground sm:opacity-60 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 hover:bg-[var(--destructive-soft)] hover:text-destructive"
        aria-label="Thema löschen"
        title="Thema löschen"
      >
        <Trash2 size={17} />
      </Button>
    </div>
  );
}
