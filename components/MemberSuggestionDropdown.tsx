import React from "react";
import { createPortal } from "react-dom";
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

  const dropdown = (
    <div
      ref={containerRef}
      style={{ position, ...style }}
      className={
        className ??
        "glass-popover materialize z-20 rounded-xl p-1"
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

  if (position === "fixed" && typeof document !== "undefined") {
    return createPortal(dropdown, document.body);
  }

  return dropdown;
}
