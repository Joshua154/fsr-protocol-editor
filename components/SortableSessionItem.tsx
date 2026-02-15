import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Member, SessionItem } from "@/common/types";
import { MemberSuggestionDropdown } from "@/components/MemberSuggestionDropdown";
import { useMemberSuggestions } from "@/hooks/useMemberSuggestions";

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
  activeIndex: number;
  anchor: { top: number; left: number; width: number } | null;
  triggerIndex: number | null;
  cursorIndex: number | null;
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
  const pendingSelectionRef = useRef<{
    target: MentionTarget;
    pos: number;
  } | null>(null);

  const [mention, setMention] = useState<MentionState>({
    isOpen: false,
    target: null,
    query: "",
    activeIndex: 0,
    anchor: null,
    triggerIndex: null,
    cursorIndex: null,
  });

  const { matches: mentionMatches } = useMemberSuggestions(
    memberSuggestions,
    mention.query,
    {
      enabled: mention.isOpen,
      limit: 10,
    }
  );

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
      activeIndex: 0,
      anchor: null,
      triggerIndex: null,
      cursorIndex: null,
    }));
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
      activeIndex: 0,
      anchor: {
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      },
      triggerIndex: ctx.triggerIndex,
      cursorIndex,
    }));
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

  const handleMentionKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!mention.isOpen) return false;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMention((m) => ({
          ...m,
          activeIndex:
            mentionMatches.length === 0
              ? 0
              : (m.activeIndex + 1) % mentionMatches.length,
        }));
        return true;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setMention((m) => ({
          ...m,
          activeIndex:
            mentionMatches.length === 0
              ? 0
              : (m.activeIndex - 1 + mentionMatches.length) % mentionMatches.length,
        }));
        return true;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        if (mentionMatches.length === 0) return false;
        e.preventDefault();
        applyMention(mentionMatches[Math.max(0, mention.activeIndex)]!.name);
        return true;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeMention();
        return true;
      }
      return false;
    },
    [mention.isOpen, mention.activeIndex, mentionMatches, applyMention, closeMention]
  );

  const onEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (handleMentionKeyDown(e)) return;
      e.stopPropagation();
    },
    [handleMentionKeyDown]
  );

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-card rounded-xl shadow-md border overflow-hidden group transition-shadow ${
        isDragging ? "border-indigo-500 shadow-xl relative" : "border-slate-200 dark:border-border dark:shadow-none"
      }`}
    >
      <MemberSuggestionDropdown
        isOpen={mention.isOpen && !!mention.anchor}
        members={mentionMatches}
        activeIndex={mention.activeIndex}
        onPick={(m) => applyMention(m.name)}
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
