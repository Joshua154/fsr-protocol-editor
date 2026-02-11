"use client";

import React from "react";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SessionItem } from "@/common/types";
import { useI18n } from "@/components/I18nProvider";

interface SortableSessionItemProps {
  item: SessionItem;
  updateTopicTitle: (id: string, val: string) => void;
  removeTopic: (id: string) => void;
  addPoint: (id: string) => void;
  updatePoint: (id: string, idx: number, val: string) => void;
  removePoint: (id: string, idx: number) => void;
}

export const SortableSessionItem = ({
  item,
  updateTopicTitle,
  removeTopic,
  addPoint,
  updatePoint,
  removePoint,
}: SortableSessionItemProps) => {
  const { t } = useI18n();
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-card rounded-xl shadow-md border overflow-hidden group transition-shadow ${
        isDragging ? "border-indigo-500 shadow-xl relative" : "border-slate-200 dark:border-border dark:shadow-none"
      }`}
    >
      {/* Topic Header */}
      <div className="bg-slate-50 dark:bg-zinc-900 p-4 border-b border-slate-100 dark:border-border flex gap-4 items-center">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-primary p-1"
          title={t("session.dragToSort")}
        >
          <GripVertical size={20} />
        </div>
        
        <input
          type="text"
          value={item.topic}
          onChange={(e) => updateTopicTitle(item.id, e.target.value)}
          className="flex-1 bg-transparent text-lg font-semibold text-slate-800 dark:text-foreground placeholder-slate-400 dark:placeholder-muted-foreground outline-none focus:underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4"
          placeholder={t("session.topicPlaceholder")}
          onKeyDown={(e) => e.stopPropagation()} // Stop DND from interfering with typing
        />
        <button
          onClick={() => removeTopic(item.id)}
          className="text-slate-400 dark:text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
          title={t("session.deleteTopicTitle")}
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
              value={point}
              onChange={(e) => updatePoint(item.id, idx, e.target.value)}
              className="flex-1 bg-transparent resize-none border-b border-transparent focus:border-indigo-200 dark:focus:border-primary outline-none py-1 text-slate-600 dark:text-foreground leading-relaxed"
              rows={
                point == null || point === ""
                  ? 1
                  : Math.max(1, Math.ceil(point.length / 80))
              }
              placeholder={t("session.pointPlaceholder")}
              onKeyDown={(e) => e.stopPropagation()} 
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
          <Plus size={14} /> {t("session.addPoint")}
        </button>
      </div>
    </div>
  );
};
