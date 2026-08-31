import React, { useRef, useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Member } from "@/common/types";
import { MemberSuggestions } from "@/components/MemberSuggestions";
import { useSuggestionNavigation } from "@/hooks/useSuggestionNavigation";

interface TagInputProps {
  label: string;
  selected: string[];
  setSelected: (val: string[]) => void;
  suggestions: Member[];
  maxSelections?: number;
}

export const TagInput = ({
  label,
  selected,
  setSelected,
  suggestions,
  maxSelections = -1,
}: TagInputProps) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState<Member[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  const canOpenSuggestions =
    isOpen && (maxSelections === -1 || selected.length < maxSelections);

  const { activeIndex, onKeyDown: onSuggestionKeyDown, setActiveIndex } =
    useSuggestionNavigation({
      isOpen: canOpenSuggestions,
      matches,
      onPick: (member) => addTag(member.name),
      onClose: () => setIsOpen(false),
    });

  const addTag = (tag: string) => {
    if (maxSelections !== -1 && selected.length >= maxSelections) return;
    if (tag.trim() && !selected.includes(tag.trim())) {
      setSelected([...selected, tag.trim()]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    setSelected(selected.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onSuggestionKeyDown(e)) return;
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative group">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-secondary-foreground"
        >
          {label}
        </label>
      )}
      <div
        className="control-surface flex min-h-11 flex-wrap gap-1.5 rounded-xl p-1.5 transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-primary focus-within:bg-[var(--card-strong)] focus-within:ring-4 focus-within:ring-[var(--ring)]"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="flex min-h-8 items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-sm font-semibold text-accent-foreground"
          >
            {tag}
            <button
              type="button"
              aria-label={`${tag} entfernen`}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="focus-ring -mr-1 rounded-md p-1 text-accent-foreground/70 transition-colors hover:bg-black/5 hover:text-accent-foreground dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <MemberSuggestions
          isOpen={canOpenSuggestions}
          members={suggestions}
          query={input}
          excludeNames={selected}
          limit={50}
          activeIndex={activeIndex}
          onMatchesChange={(next) => {
            setMatches(next);
            setActiveIndex(0);
          }}
          onPick={(member) => addTag(member.name)}
          className="glass-popover materialize absolute left-0 top-full z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl py-1 subtle-scrollbar"
          renderRight={() => (
            <Plus
              size={14}
              className="text-muted-foreground"
            />
          )}
        />
        <div className="relative min-w-28 flex-1">
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 50)}
            disabled={maxSelections !== -1 && selected.length >= maxSelections}
            onKeyDown={handleKeyDown}
            className="h-full min-h-8 w-full bg-transparent px-1.5 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={selected.length === 0 ? "Namen auswählen..." : ""}
          />
        </div>
      </div>
    </div>
  );
};
