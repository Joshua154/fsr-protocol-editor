import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

type Props = {
  points: string[];
  pointRefs: React.MutableRefObject<(HTMLTextAreaElement | null)[]>;
  onChange: (
    index: number,
    element: HTMLTextAreaElement,
    value: string
  ) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onBlur: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function SessionPointList({
  points,
  pointRefs,
  onChange,
  onKeyDown,
  onBlur,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="p-4 sm:p-5">
      <div className="space-y-2">
        {points.map((point, index) => (
          <div
            key={index}
            className="group/point grid grid-cols-[1rem_minmax(0,1fr)_2.5rem] items-start gap-2 rounded-xl transition-colors hover:bg-[color:var(--muted)]/45 sm:gap-3"
          >
            <span className="mt-[1.15rem] h-1.5 w-1.5 justify-self-center rounded-full bg-primary shadow-[0_0_0_4px_var(--ring)]" />
            <textarea
              ref={(element) => {
                pointRefs.current[index] = element;
              }}
              value={point}
              onChange={(event) =>
                onChange(index, event.currentTarget, event.target.value)
              }
              className="min-h-11 w-full resize-none rounded-xl border border-transparent bg-transparent px-2 py-2.5 text-sm leading-relaxed text-secondary-foreground outline-none transition-colors placeholder:text-muted-foreground focus:text-foreground sm:text-[0.9375rem]"
              rows={
                point == null || point === ""
                  ? 1
                  : Math.max(1, Math.ceil(point.length / 80))
              }
              placeholder="Diskussion, Ergebnis oder Aufgabe festhalten …"
              onKeyDown={onKeyDown}
              onBlur={onBlur}
            />
            <Button
              onClick={() => onRemove(index)}
              variant="quiet"
              size="icon"
              className="scale-95 text-muted-foreground opacity-60 hover:bg-[var(--destructive-soft)] hover:text-destructive sm:opacity-0 sm:group-hover/point:scale-100 sm:group-hover/point:opacity-100 sm:focus-visible:scale-100 sm:focus-visible:opacity-100"
              aria-label={`Punkt ${index + 1} löschen`}
              title="Punkt löschen"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        ))}

        {points.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Noch keine Punkte in diesem Thema.
          </div>
        )}
      </div>

      <Button
        onClick={onAdd}
        variant="quiet"
        size="sm"
        className="mt-3 w-full border border-dashed border-[var(--border-strong)] bg-[color:var(--muted)]/20 text-primary hover:border-primary hover:bg-accent hover:text-accent-foreground"
      >
        <Plus size={15} /> Punkt hinzufügen
      </Button>
    </div>
  );
}
