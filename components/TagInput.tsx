import React, { useState, useRef, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  label: string;
  selected: string[];
  setSelected: (val: string[]) => void;
  suggestions: string[];
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
  const inputRef = useRef<HTMLInputElement>(null);

  const availableOptions = suggestions.filter(
    (s) =>
      !selected.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

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
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div
        className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 min-h-11.5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-md"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-indigo-900 cursor-pointer"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {isOpen &&
          availableOptions.length > 0 &&
          (maxSelections === -1 || selected.length < maxSelections) && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
              {availableOptions.map((option) => (
                <button
                  key={option}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTag(option);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 flex justify-between items-center"
                >
                  {option}
                  <Plus size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          )}
        <div className="relative flex-1 min-w-30">
          <input
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
            className="w-full bg-transparent outline-none text-sm h-full py-1 text-slate-700"
            placeholder={selected.length === 0 ? "Namen auswählen..." : ""}
          />
        </div>
      </div>
    </div>
  );
};
