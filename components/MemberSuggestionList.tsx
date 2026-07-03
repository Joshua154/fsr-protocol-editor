import React, { useEffect, useRef } from "react";
import { Member } from "@/common/types";
import { AppButton } from "@/components/ui";

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
        <AppButton
          key={member.name}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          variant="suggestion"
          data-active={idx === activeIndex ? "true" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(member);
          }}
        >
          <div className="flex flex-col">
            <span>{member.name}</span>
            {member.aliases && member.aliases.length > 0 && (
              <span className="text-sm text-slate-400 dark:text-muted-foreground">
                {member.aliases.join(", ")}
              </span>
            )}
          </div>
          {renderRight ? renderRight(member) : null}
        </AppButton>
      ))}
    </>
  );
}
