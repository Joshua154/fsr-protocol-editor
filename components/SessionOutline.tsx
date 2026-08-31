import React from "react";
import { FileText, ListTree } from "lucide-react";

import { SessionItem } from "@/common/types";
import { Badge, Eyebrow, Surface } from "@/components/ui/Primitives";

interface SessionOutlineProps {
  sessionItems: SessionItem[];
}

const SHOULD_SHOW_POINT_LABELS = false;

const getPointLabel = (point: string, index: number) => {
  const label = point.trim().replace(/\s+/g, " ");
  return label || `Punkt ${index + 1}`;
};

export function SessionOutline({ sessionItems }: SessionOutlineProps) {
  return (
    <Surface
      as="aside"
      className="hidden overflow-hidden lg:sticky lg:top-[5.75rem] lg:block lg:max-h-[calc(100vh-7.25rem)] lg:self-start"
    >
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Eyebrow>Navigation</Eyebrow>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-bold tracking-[-0.025em]">
              <ListTree size={19} className="text-primary" />
              Gliederung
            </h2>
          </div>
          {/* <Badge tone={sessionItems.length ? "accent" : "neutral"}>
            {sessionItems.length}
          </Badge> */}
        </div>
      </div>

      <nav
        aria-label="Gliederung der Sitzungsinhalte"
        className="subtle-scrollbar overflow-y-auto p-3 lg:max-h-[calc(100vh-15rem)]"
      >
        {sessionItems.length > 0 ? (
          <ol className="space-y-1">
            {sessionItems.map((item, topicIndex) => (
              <li key={item.id}>
                <a
                  href={`#session-topic-${item.id}`}
                  className="focus-ring group flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-[0.6875rem] text-muted-foreground group-hover:bg-[var(--card-strong)] group-hover:text-primary">
                    {topicIndex + 1}
                  </span>
                  <span className="truncate">
                    {item.topic.trim() || `Thema ${topicIndex + 1}`}
                  </span>
                </a>

                {SHOULD_SHOW_POINT_LABELS && item.points.length > 0 && (
                  <ol className="relative ml-6 border-l border-border py-1 pl-3">
                    {item.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="relative">
                        <span className="absolute -left-[0.8125rem] top-1/2 h-px w-2 bg-border" />
                        <a
                          href={`#session-point-${item.id}-${pointIndex}`}
                          title={getPointLabel(point, pointIndex)}
                          className="focus-ring block truncate rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {getPointLabel(point, pointIndex)}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="px-3 py-8 text-center">
            <FileText size={24} className="mx-auto text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">Noch keine Gliederung</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Neue Themen erscheinen hier automatisch.
            </p>
          </div>
        )}
      </nav>
    </Surface>
  );
}
