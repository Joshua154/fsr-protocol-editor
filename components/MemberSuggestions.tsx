import React, { useEffect, useRef } from "react";
import type { Member } from "@/common/types";
import { MemberSuggestionDropdown } from "@/components/MemberSuggestionDropdown";
import { useMemberSuggestions } from "@/hooks/useMemberSuggestions";

type Props = {
  isOpen: boolean;
  members: Member[];
  query: string;
  excludeNames?: string[];
  limit?: number;
  onPick: (member: Member) => void;
  activeIndex?: number;
  renderRight?: (member: Member) => React.ReactNode;
  position?: "absolute" | "fixed";
  style?: React.CSSProperties;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onMatchesChange?: (matches: Member[]) => void;
};

export function MemberSuggestions({
  isOpen,
  members,
  query,
  excludeNames,
  limit,
  onPick,
  activeIndex,
  renderRight,
  position = "absolute",
  style,
  className,
  containerRef,
  onMatchesChange,
}: Props) {
  const { matches } = useMemberSuggestions(members, query, {
    enabled: isOpen,
    excludeNames,
    limit,
  });

  const onMatchesChangeRef = useRef(onMatchesChange);

  useEffect(() => {
    onMatchesChangeRef.current = onMatchesChange;
  }, [onMatchesChange]);

  useEffect(() => {
    const handler = onMatchesChangeRef.current;
    if (!handler) return;
    if (!isOpen) {
      handler([]);
      return;
    }
    handler(matches);
  }, [isOpen, matches]);

  return (
    <MemberSuggestionDropdown
      isOpen={isOpen}
      members={matches}
      activeIndex={activeIndex}
      onPick={onPick}
      renderRight={renderRight}
      position={position}
      style={style}
      className={className}
      containerRef={containerRef}
    />
  );
}
