import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Member, SessionItem } from "@/common/types";
import {
  CommandArguments,
  commandRequiresArguments,
  insertAtCommandRange,
  RegisteredSessionCommand,
  sessionCommandRegistry,
} from "@/common/sessionCommands";
import { CommandArgumentForm } from "@/components/CommandArgumentForm";
import { CommandSuggestions } from "@/components/CommandSuggestions";
import { MemberSuggestions } from "@/components/MemberSuggestions";
import { Modal } from "@/components/Modal";
import { useSuggestionNavigation } from "@/hooks/useSuggestionNavigation";
import { SessionTopicHeader } from "@/components/session/SessionTopicHeader";
import { SessionPointList } from "@/components/session/SessionPointList";

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
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.88 : 1,
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

  const commandRef = useRef(command);
  commandRef.current = command;

  const resetCommandState = useCallback(() => {
    setCommand({
      isOpen: false,
      target: null,
      query: "",
      anchor: null,
      triggerIndex: null,
      cursorIndex: null,
      selectedCommand: null,
    });
  }, []);

  const executeCommand = useCallback(
    async (
      selectedCommand: RegisteredSessionCommand,
      args: CommandArguments,
      execution: Pick<CommandState, "target" | "triggerIndex" | "cursorIndex">
    ) => {
      const { target, triggerIndex, cursorIndex } = execution;
      if (!target || triggerIndex == null || cursorIndex == null) return;

      const text =
        target.type === "topic"
          ? item.topic
          : item.points[target.idx] ?? "";

      const result = await selectedCommand.execute(args, {
        sourceText: text,
        triggerIndex,
        cursorIndex,
      });
      const { nextText, nextCursor } = insertAtCommandRange(
        text,
        triggerIndex,
        cursorIndex,
        result.text
      );

      if (target.type === "topic") {
        updateTopicTitle(item.id, nextText);
      } else {
        updatePoint(item.id, target.idx, nextText);
      }

      pendingSelectionRef.current = { target, pos: nextCursor };
      resetCommandState();
    },
    [item.id, item.points, item.topic, resetCommandState, updatePoint, updateTopicTitle]
  );

  const pickCommand = useCallback(
    (nextCommand: RegisteredSessionCommand) => {
      const current = commandRef.current;
      if (!commandRequiresArguments(nextCommand)) {
        setCommand((state) => ({ ...state, isOpen: false }));
        void executeCommand(nextCommand, {}, current);
        return;
      }
      setCommand({
        ...current,
        isOpen: false,
        selectedCommand: nextCommand,
      });
    },
    [executeCommand]
  );

  const applyCommand = useCallback(
    async (args: CommandArguments) => {
      if (!command.selectedCommand) return;
      await executeCommand(command.selectedCommand, args, command);
    },
    [command, executeCommand]
  );

  const {
    activeIndex: commandActiveIndex,
    onKeyDown: onCommandKeyDown,
    setActiveIndex: setCommandActiveIndex,
  } = useSuggestionNavigation({
    isOpen: command.isOpen,
    matches: commandMatches,
    onPick: pickCommand,
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
      className={`glass-surface group overflow-hidden rounded-[var(--radius-card)] transition-[box-shadow,border-color,opacity] ${
        isDragging
          ? "relative border-primary shadow-[0_28px_80px_var(--glass-shadow)]"
          : "hover:border-[var(--border-strong)]"
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
        className="glass-popover materialize z-50 max-h-56 overflow-y-auto rounded-xl p-1 subtle-scrollbar"
      />

      <CommandSuggestions
        isOpen={command.isOpen && !!command.anchor}
        commands={commandMatches}
        activeIndex={commandActiveIndex}
        onPick={pickCommand}
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
        className="glass-popover materialize z-50 max-h-56 overflow-y-auto rounded-xl p-1 subtle-scrollbar"
      />

      {command.selectedCommand && commandRequiresArguments(command.selectedCommand) && (
        <Modal
          isOpen
          onClose={closeCommandForm}
          title="Befehl ausführen"
          width="sm"
        >
          <CommandArgumentForm
            key={command.selectedCommand.name}
            command={command.selectedCommand}
            onSubmit={applyCommand}
            onCancel={closeCommandForm}
          />
        </Modal>
      )}

      <SessionTopicHeader
        value={item.topic}
        topicRef={topicRef}
        dragHandleProps={{ ...attributes, ...listeners }}
        onChange={(element, value) => {
          updateTopicTitle(item.id, value);
          updateMentionFromInput({ type: "topic" }, element, value);
          updateCommandFromInput({ type: "topic" }, element, value);
        }}
        onKeyDown={onEditorKeyDown}
        onBlur={() => setTimeout(() => closeMention(), 80)}
        onRemove={() => removeTopic(item.id)}
      />

      <SessionPointList
        points={item.points}
        pointRefs={pointRefs}
        onChange={(idx, element, value) => {
          updatePoint(item.id, idx, value);
          updateMentionFromInput({ type: "point", idx }, element, value);
          updateCommandFromInput({ type: "point", idx }, element, value);
        }}
        onKeyDown={onEditorKeyDown}
        onBlur={() => setTimeout(() => closeMention(), 80)}
        onAdd={() => addPoint(item.id)}
        onRemove={(idx) => removePoint(item.id, idx)}
      />
    </div>
  );
};
