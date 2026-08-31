import React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

type Props = {
  value: string;
  topicRef: React.RefObject<HTMLInputElement | null>;
  dragHandleProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onChange: (element: HTMLInputElement, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onBlur: () => void;
  onRemove: () => void;
};

export function SessionTopicHeader({
  value,
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
        className="focus-ring flex h-10 w-8 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-primary active:cursor-grabbing"
        aria-label="Thema verschieben"
        title="Ziehen zum Sortieren"
      >
        <GripVertical size={19} />
      </button>

      <input
        ref={topicRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.currentTarget, event.target.value)}
        className="focus-ring min-h-11 min-w-0 flex-1 rounded-xl border border-transparent bg-transparent px-2 text-base font-bold tracking-[-0.02em] text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:bg-[color:var(--input)]/50 focus:border-primary focus:bg-[var(--card-strong)] sm:text-lg"
        placeholder="Thema benennen …"
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />

      <Button
        onClick={onRemove}
        variant="quiet"
        size="icon"
        className="shrink-0 text-muted-foreground hover:bg-[var(--destructive-soft)] hover:text-destructive"
        aria-label="Thema löschen"
        title="Thema löschen"
      >
        <Trash2 size={17} />
      </Button>
    </div>
  );
}
