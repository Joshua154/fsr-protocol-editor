import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Member, SessionItem } from "@/common/types";
import {
  CommandArguments,
  RegisteredSessionCommand,
  sessionCommandRegistry,
} from "@/common/sessionCommands";
import { CommandArgumentForm } from "@/components/CommandArgumentForm";
import { CommandSuggestions } from "@/components/CommandSuggestions";
import { MemberSuggestions } from "@/components/MemberSuggestions";
import { Modal } from "@/components/Modal";
import { useSuggestionNavigation } from "@/hooks/useSuggestionNavigation";

interface SortableSessionItemProps {
  item: SessionItem;
  memberSuggestions: Member[];
  updateTopicTitle: (id: string, val: string) => void;
  removeTopic: (id: string) => void;
  addPoint: (id: string) => void;
  updatePoint: (id: string, idx: number, val: string) => void;
  removePoint: (id: string, idx: number) => void;
}

type MentionTarget =
  | { type: "topic" }
  | { type: "point"; idx: number };

type MentionState = {
  isOpen: boolean;
  target: MentionTarget | null;
  query: string;
  anchor: { top: number; left: number; width: number } | null;
  triggerIndex: number | null;
  cursorIndex: number | null;
};

type CommandState = {
  isOpen: boolean;
  target: MentionTarget | null;
  query: string;
  anchor: { top: number; left: number; width: number } | null;
  triggerIndex: number | null;
  cursorIndex: number | null;
  selectedCommand: RegisteredSessionCommand | null;
};

export const SortableSessionItem = ({
  item,
  memberSuggestions,
  updateTopicTitle,
  removeTopic,
  addPoint,
  updatePoint,
  removePoint,
}: SortableSessionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto", // Bring dragged item to front
    opacity: isDragging ? 0.9 : 1,
  };

  const topicRef = useRef<HTMLInputElement | null>(null);
  const pointRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const commandDropdownRef = useRef<HTMLDivElement | null>(null);
  const pendingSelectionRef = useRef<{
    target: MentionTarget;
    pos: number;
  } | null>(null);

  const [mention, setMention] = useState<MentionState>({
    isOpen: false,
    target: null,
    query: "",
    anchor: null,
    triggerIndex: null,
    cursorIndex: null,
  });

  const [mentionMatches, setMentionMatches] = useState<Member[]>([]);
  const [command, setCommand] = useState<CommandState>({
    isOpen: false,
    target: null,
    query: "",
    anchor: null,
    triggerIndex: null,
    cursorIndex: null,
    selectedCommand: null,
  });

  const commandMatches = sessionCommandRegistry.filter(command.query);

  const getTargetEl = (target: MentionTarget | null) => {
    if (!target) return null;
    if (target.type === "topic") return topicRef.current;
    return pointRefs.current[target.idx] ?? null;
  };

  const closeMention = useCallback(() => {
    setMention((m) => ({
      ...m,
      isOpen: false,
      target: null,
      query: "",
      anchor: null,
      triggerIndex: null,
      cursorIndex: null,
    }));
  }, []);

  const closeCommand = useCallback(() => {
    setCommand((current) => ({
      ...current,
      isOpen: false,
      target: null,
      query: "",
      anchor: null,
      triggerIndex: null,
      cursorIndex: null,
    }));
  }, []);

  const closeCommandForm = useCallback(() => {
    setCommand((current) => ({ ...current, selectedCommand: null }));
  }, []);

  const findMentionContext = (text: string, cursorIndex: number) => {
    const uptoCursor = text.slice(0, cursorIndex);
    const at = uptoCursor.lastIndexOf("@");
    if (at < 0) return null;
    const prev = at === 0 ? "" : uptoCursor[at - 1];
    if (prev && !/\s|[([{"'`]/.test(prev)) return null;
    const query = uptoCursor.slice(at + 1);
    if (/\s/.test(query)) return null;
    return { triggerIndex: at, query };
  };

  const findCommandContext = (text: string, cursorIndex: number) => {
    const uptoCursor = text.slice(0, cursorIndex);
    const slash = uptoCursor.lastIndexOf("/");
    if (slash < 0) return null;
    const prev = slash === 0 ? "" : uptoCursor[slash - 1];
    if (prev && !/\s|[([{"'`]/.test(prev)) return null;
    const query = uptoCursor.slice(slash + 1);
    if (/\s/.test(query)) return null;
    return { triggerIndex: slash, query };
  };

  const updateMentionFromInput = (
    target: MentionTarget,
    el: HTMLInputElement | HTMLTextAreaElement | null,
    text: string
  ) => {
    if (!el) return closeMention();
    const cursorIndex = el.selectionStart ?? text.length;
    const ctx = findMentionContext(text, cursorIndex);
    if (!ctx) return closeMention();

    const rect = el.getBoundingClientRect();
    setMention((m) => ({
      ...m,
      isOpen: true,
      target,
      query: ctx.query,
      anchor: {
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      },
      triggerIndex: ctx.triggerIndex,
      cursorIndex,
    }));
  };

  const updateCommandFromInput = (
    target: MentionTarget,
    el: HTMLInputElement | HTMLTextAreaElement | null,
    text: string
  ) => {
    if (!el) return closeCommand();
    const cursorIndex = el.selectionStart ?? text.length;
    const ctx = findCommandContext(text, cursorIndex);
    if (!ctx) return closeCommand();

    const rect = el.getBoundingClientRect();
    setCommand((current) => ({
      ...current,
      isOpen: true,
      target,
      query: ctx.query,
      anchor: {
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      },
      triggerIndex: ctx.triggerIndex,
      cursorIndex,
    }));
    closeMention();
  };

  const applyMention = useCallback((memberName: string) => {
    if (!mention.isOpen || !mention.target) return;
    const target = mention.target;
    const text =
      target.type === "topic"
        ? item.topic
        : item.points[target.idx] ?? "";
    const triggerIndex = mention.triggerIndex;
    const cursorIndex = mention.cursorIndex;
    if (triggerIndex == null || cursorIndex == null) return;

    const before = text.slice(0, triggerIndex);
    const after = text.slice(cursorIndex);
    const insert = `${memberName}`;
    const needsSpace = after.length > 0 && !/^\s/.test(after);
    const nextText = `${before}${insert}${needsSpace ? " " : ""}${after}`;
    const nextCursor = (before + insert + (needsSpace ? " " : "")).length;

    if (target.type === "topic") {
      updateTopicTitle(item.id, nextText);
    } else {
      updatePoint(item.id, target.idx, nextText);
    }

    pendingSelectionRef.current = { target, pos: nextCursor };
    closeMention();
  }, [
    closeMention,
    item.id,
    item.points,
    item.topic,
    mention.cursorIndex,
    mention.isOpen,
    mention.target,
    mention.triggerIndex,
    updatePoint,
    updateTopicTitle,
  ]);

  const {
    activeIndex: mentionActiveIndex,
    onKeyDown: onMentionKeyDown,
    setActiveIndex: setMentionActiveIndex,
  } = useSuggestionNavigation({
    isOpen: mention.isOpen,
    matches: mentionMatches,
    onPick: (member) => applyMention(member.name),
    onClose: closeMention,
  });

  const openCommandForm = useCallback((nextCommand: RegisteredSessionCommand) => {
    setCommand((current) => ({
      ...current,
      isOpen: false,
      selectedCommand: nextCommand,
    }));
  }, []);

  const applyCommand = useCallback(async (args: CommandArguments) => {
    if (!command.selectedCommand || !command.target) return;
    const target = command.target;
    const text =
      target.type === "topic"
        ? item.topic
        : item.points[target.idx] ?? "";
    const triggerIndex = command.triggerIndex;
    const cursorIndex = command.cursorIndex;
    if (triggerIndex == null || cursorIndex == null) return;

    const result = await command.selectedCommand.execute(args, {
      sourceText: text,
      triggerIndex,
      cursorIndex,
    });
    const before = text.slice(0, triggerIndex);
    const after = text.slice(cursorIndex);
    const insert = result.text;
    const needsSpace = after.length > 0 && !/^\s/.test(after);
    const nextText = `${before}${insert}${needsSpace ? " " : ""}${after}`;
    const nextCursor = (before + insert + (needsSpace ? " " : "")).length;

    if (target.type === "topic") {
      updateTopicTitle(item.id, nextText);
    } else {
      updatePoint(item.id, target.idx, nextText);
    }

    pendingSelectionRef.current = { target, pos: nextCursor };
    setCommand({
      isOpen: false,
      target: null,
      query: "",
      anchor: null,
      triggerIndex: null,
      cursorIndex: null,
      selectedCommand: null,
    });
  }, [
    command.cursorIndex,
    command.selectedCommand,
    command.target,
    command.triggerIndex,
    item.id,
    item.points,
    item.topic,
    updatePoint,
    updateTopicTitle,
  ]);

  const {
    activeIndex: commandActiveIndex,
    onKeyDown: onCommandKeyDown,
    setActiveIndex: setCommandActiveIndex,
  } = useSuggestionNavigation({
    isOpen: command.isOpen,
    matches: commandMatches,
    onPick: openCommandForm,
    onClose: closeCommand,
  });

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onCommandKeyDown(e)) return;
      if (onMentionKeyDown(e)) return;
      e.stopPropagation();
    },
    [onCommandKeyDown, onMentionKeyDown]
  );

  useEffect(() => {
    setCommandActiveIndex(0);
  }, [command.query, setCommandActiveIndex]);

  useLayoutEffect(() => {
    const pending = pendingSelectionRef.current;
    if (!pending) return;
    const el = getTargetEl(pending.target);
    if (!el) return;
    try {
      el.focus();
      el.setSelectionRange(pending.pos, pending.pos);
    } finally {
      pendingSelectionRef.current = null;
    }
  }, [item.topic, item.points]);

  useEffect(() => {
    if (!mention.isOpen) return;
    const onMouseDown = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      const el = getTargetEl(mention.target);
      if (dropdownRef.current?.contains(target as Node)) return;
      if (el?.contains(target as Node)) return;
      closeMention();
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [mention.isOpen, mention.target, closeMention]);

  useEffect(() => {
    if (!command.isOpen) return;
    const onMouseDown = (ev: MouseEvent) => {
      const target = ev.target as Node | null;
      const el = getTargetEl(command.target);
      if (commandDropdownRef.current?.contains(target as Node)) return;
      if (el?.contains(target as Node)) return;
      closeCommand();
    };
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [command.isOpen, command.target, closeCommand]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-card rounded-xl shadow-md border overflow-hidden group transition-shadow ${
        isDragging ? "border-indigo-500 shadow-xl relative" : "border-slate-200 dark:border-border dark:shadow-none"
      }`}
    >
      <MemberSuggestions
        isOpen={mention.isOpen && !!mention.anchor}
        members={memberSuggestions}
        query={mention.query}
        limit={10}
        activeIndex={mentionActiveIndex}
        onPick={(m) => applyMention(m.name)}
        onMatchesChange={(next) => {
          setMentionMatches(next);
          setMentionActiveIndex(0);
        }}
        renderRight={() => (
          <span className="text-slate-400 dark:text-muted-foreground">@</span>
        )}
        containerRef={dropdownRef}
        position="fixed"
        style={
          mention.anchor
            ? {
                top: mention.anchor.top,
                left: mention.anchor.left,
                width: mention.anchor.width,
              }
            : undefined
        }
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-border rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto"
      />

      <CommandSuggestions
        isOpen={command.isOpen && !!command.anchor}
        commands={commandMatches}
        activeIndex={commandActiveIndex}
        onPick={openCommandForm}
        containerRef={commandDropdownRef}
        position="fixed"
        style={
          command.anchor
            ? {
                top: command.anchor.top,
                left: command.anchor.left,
                width: command.anchor.width,
              }
            : undefined
        }
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-border rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto"
      />

      <Modal
        isOpen={!!command.selectedCommand}
        onClose={closeCommandForm}
        title="Befehl ausführen"
        width="sm"
      >
        {command.selectedCommand && (
          <CommandArgumentForm
            command={command.selectedCommand}
            onSubmit={applyCommand}
            onCancel={closeCommandForm}
          />
        )}
      </Modal>

      {/* Topic Header */}
      <div className="bg-slate-50 dark:bg-zinc-900 p-4 border-b border-slate-100 dark:border-border flex gap-4 items-center">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-primary p-1"
          title="Ziehen zum Sortieren"
        >
          <GripVertical size={20} />
        </div>
        
        <input
          ref={topicRef}
          type="text"
          value={item.topic}
          onChange={(e) => {
            updateTopicTitle(item.id, e.target.value);
            updateMentionFromInput({ type: "topic" }, e.currentTarget, e.target.value);
            updateCommandFromInput({ type: "topic" }, e.currentTarget, e.target.value);
          }}
          className="flex-1 bg-transparent text-lg font-semibold text-slate-800 dark:text-foreground placeholder-slate-400 dark:placeholder-muted-foreground outline-none focus:underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4"
          placeholder="Thema Titel..."
          onKeyDown={onEditorKeyDown} // Stop DND from interfering with typing
          onBlur={() => setTimeout(() => closeMention(), 80)}
        />
        <button
          onClick={() => removeTopic(item.id)}
          className="text-slate-400 dark:text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
          title="Thema löschen"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Bullet Points */}
      <div className="p-4 space-y-3">
        {item.points.map((point, idx) => (
          <div key={idx} className="flex gap-3 items-start group/point">
            <div className="mt-3.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></div>
            <textarea
              ref={(el) => {
                pointRefs.current[idx] = el;
              }}
              value={point}
              onChange={(e) => {
                updatePoint(item.id, idx, e.target.value);
                updateMentionFromInput(
                  { type: "point", idx },
                  e.currentTarget,
                  e.target.value
                );
                updateCommandFromInput(
                  { type: "point", idx },
                  e.currentTarget,
                  e.target.value
                );
              }}
              className="flex-1 bg-transparent resize-none border-b border-transparent focus:border-indigo-200 dark:focus:border-primary outline-none py-1 text-slate-600 dark:text-foreground leading-relaxed"
              rows={
                point == null || point === ""
                  ? 1
                  : Math.max(1, Math.ceil(point.length / 80))
              }
              placeholder="Inhalt des Tagesordnungspunkts..."
              onKeyDown={onEditorKeyDown}
              onBlur={() => setTimeout(() => closeMention(), 80)}
            />
            <button
              onClick={() => removePoint(item.id, idx)}
              className="opacity-0 group-hover/point:opacity-100 text-slate-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 transition-all p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addPoint(item.id)}
          className="ml-5 text-md text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 mt-2"
        >
          <Plus size={14} /> Punkt hinzufügen
        </button>
      </div>
    </div>
  );
};
