import React from "react";
import { Member } from "@/common/types";
import { MemberSuggestionList } from "@/components/MemberSuggestionList";

type Props = {
  isOpen: boolean;
  members: Member[];
  onPick: (member: Member) => void;
  activeIndex?: number;
  renderRight?: (member: Member) => React.ReactNode;
  position?: "absolute" | "fixed";
  style?: React.CSSProperties;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export function MemberSuggestionDropdown({
  isOpen,
  members,
  onPick,
  activeIndex,
  renderRight,
  position = "absolute",
  style,
  className,
  containerRef,
}: Props) {
  if (!isOpen || members.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ position, ...style }}
      className={
        className ??
        "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-border rounded-lg shadow-lg z-20"
      }
    >
      <MemberSuggestionList
        members={members}
        activeIndex={activeIndex}
        onPick={onPick}
        renderRight={renderRight}
      />
    </div>
  );
}
