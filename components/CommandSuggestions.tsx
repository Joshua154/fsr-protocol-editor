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
        "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-border rounded-lg shadow-lg z-20"
      }
    >
      <div className="py-1">
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
              className={`w-full px-3 py-2 text-left flex items-start gap-3 transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-200"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">
                <Terminal size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">/{command.name}</span>
                <span className="block text-xs text-slate-500 dark:text-muted-foreground">
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
