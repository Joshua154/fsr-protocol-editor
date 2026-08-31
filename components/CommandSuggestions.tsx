import React from "react";
import { Terminal } from "lucide-react";
import type { RegisteredSessionCommand } from "@/common/sessionCommands";

type Props = {
  isOpen: boolean;
  commands: RegisteredSessionCommand[];
  activeIndex?: number;
  onPick: (command: RegisteredSessionCommand) => void;
  position?: "absolute" | "fixed";
  style?: React.CSSProperties;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export function CommandSuggestions({
  isOpen,
  commands,
  activeIndex = 0,
  onPick,
  position = "absolute",
  style,
  className,
  containerRef,
}: Props) {
  if (!isOpen || commands.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ position, ...style }}
      className={
        className ??
        "glass-popover materialize z-20 rounded-xl p-1"
      }
    >
      <div>
        {commands.map((command, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={command.name}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onPick(command);
              }}
              className={`focus-ring flex min-h-12 w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-secondary-foreground hover:bg-muted"
              }`}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Terminal size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">/{command.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {command.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
