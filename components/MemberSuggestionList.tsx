import React, { useEffect, useRef } from "react";
import { Member } from "@/common/types";

type Props = {
  members: Member[];
  activeIndex?: number;
  onPick: (member: Member) => void;
  renderRight?: (member: Member) => React.ReactNode;
};

export function MemberSuggestionList({
  members,
  activeIndex = -1,
  onPick,
  renderRight,
}: Props) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (activeIndex < 0) return;
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    el.scrollIntoView({ block: "nearest" });
  }, [activeIndex, members.length]);

  return (
    <>
      {members.map((member, idx) => (
        <button
          key={member.name}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(member);
          }}
          className={`focus-ring flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-secondary-foreground transition-colors hover:bg-muted ${
            idx === activeIndex ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <div className="flex flex-col">
            <span>{member.name}</span>
            {member.aliases && member.aliases.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {member.aliases.join(", ")}
              </span>
            )}
          </div>
          {renderRight ? renderRight(member) : null}
        </button>
      ))}
    </>
  );
}
