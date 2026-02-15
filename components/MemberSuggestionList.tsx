import React from "react";
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
  return (
    <>
      {members.map((member, idx) => (
        <button
          key={member.name}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(member);
          }}
          className={`w-full text-left px-3 py-2 text-md text-slate-700 dark:text-foreground hover:bg-indigo-50 dark:hover:bg-zinc-800 flex justify-between items-center ${
            idx === activeIndex ? "bg-indigo-50 dark:bg-zinc-800" : ""
          }`}
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
        </button>
      ))}
    </>
  );
}
