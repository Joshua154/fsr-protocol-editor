"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import yaml from "js-yaml";
import {
  Upload,
  Plus,
  Trash2,
  Calendar,
  Users,
  FileText,
  Save,
  X,
  Clipboard,
  GripVertical,
} from "lucide-react";


import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


type SessionItem = {
  id: string;
  topic: string;
  points: string[];
};

type ProtocolData = {
  FSR: string[];
  Protokollant: string;
  WeiterePersonen: string[];
  Date: string;
  Start: string;
  Ende: string;
  Sitzung: Record<string, string[]>;
  [key: string]: unknown;
};


const ENV_FSR_MEMBERS = (process.env.NEXT_PUBLIC_FSR_MEMBERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ENV_ASSOC_MEMBERS = (process.env.NEXT_PUBLIC_ASSOCIATED_MEMBERS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);


const sessionObjectToArray = (
  sitzung: Record<string, unknown>
): SessionItem[] => {
  if (!sitzung) return [];
  return Object.entries(sitzung).map(([topic, points], index) => ({
    id: `topic-${index}-${Date.now()}`,
    topic,
    points: Array.isArray(points) ? points.map(String) : [String(points)],
  }));
};

const sessionArrayToObject = (items: SessionItem[]) => {
  const obj: Record<string, string[]> = {};
  items.forEach((item) => {
    if (item.topic.trim()) {
      obj[item.topic] = item.points;
    }
  });
  return obj;
};



const TagInput = ({
  label,
  selected,
  setSelected,
  suggestions,
  maxSelections = -1,
}: {
  label: string;
  selected: string[];
  setSelected: (val: string[]) => void;
  suggestions: string[];
  maxSelections?: number;
}) => {
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


interface SortableSessionItemProps {
  item: SessionItem;
  updateTopicTitle: (id: string, val: string) => void;
  removeTopic: (id: string) => void;
  addPoint: (id: string) => void;
  updatePoint: (id: string, idx: number, val: string) => void;
  removePoint: (id: string, idx: number) => void;
}

const SortableSessionItem = ({
  item,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow-sm border overflow-hidden group transition-shadow ${
        isDragging ? "border-indigo-500 shadow-xl relative" : "border-slate-200"
      }`}
    >
      {/* Topic Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex gap-4 items-center">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 p-1"
          title="Ziehen zum Sortieren"
        >
          <GripVertical size={20} />
        </div>
        
        <input
          type="text"
          value={item.topic}
          onChange={(e) => updateTopicTitle(item.id, e.target.value)}
          className="flex-1 bg-transparent text-lg font-semibold text-slate-800 placeholder-slate-400 outline-none focus:underline decoration-indigo-300 underline-offset-4"
          placeholder="Thema Titel..."
          onKeyDown={(e) => e.stopPropagation()} // Stop DND from interfering with typing
        />
        <button
          onClick={() => removeTopic(item.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-2"
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
              value={point}
              onChange={(e) => updatePoint(item.id, idx, e.target.value)}
              className="flex-1 bg-transparent resize-none border-b border-transparent focus:border-indigo-200 outline-none py-1 text-slate-600 leading-relaxed"
              rows={
                point == null || point === ""
                  ? 1
                  : Math.max(1, Math.ceil(point.length / 80))
              }
              placeholder="Inhalt des Tagesordnungspunkts..."
              onKeyDown={(e) => e.stopPropagation()} 
            />
            <button
              onClick={() => removePoint(item.id, idx)}
              className="opacity-0 group-hover/point:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addPoint(item.id)}
          className="ml-5 text-sm text-slate-400 hover:text-indigo-600 flex items-center gap-1 mt-2"
        >
          <Plus size={14} /> Punkt hinzufügen
        </button>
      </div>
    </div>
  );
};



export default function ProtocolEditor() {
  const [fsrMembers, setFsrMembers] = useState<string[]>([]);
  const [guests, setGuests] = useState<string[]>([]);
  const [protocolant, setProtocolant] = useState<string[]>([]);

  const [meta, setMeta] = useState({
    Date: new Date().toISOString().split("T")[0],
    Start: "16:30",
    Ende: "17:30",
  });
  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevents accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const processYamlContent = (content: string) => {
    try {
      const parsed = yaml.load(content) as ProtocolData;
      if (!parsed) throw new Error("Empty YAML");

      const parseList = (input: unknown): string[] => {
        if (Array.isArray(input))
          return input.map(String).map((s) => s.trim()).filter(Boolean);
        if (typeof input === "string")
          return input.split(",").map((s) => s.trim()).filter(Boolean);
        return [];
      };

      setFsrMembers(parseList(parsed.FSR));
      setProtocolant(parsed.Protokollant ? [String(parsed.Protokollant)] : []);
      setGuests(parseList(parsed.WeiterePersonen));

      setMeta({
        Date: parsed.Date
          ? new Date(parsed.Date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        Start: parsed.Start ? String(parsed.Start) : "16:30",
        Ende: parsed.Ende ? String(parsed.Ende) : "17:30",
      });

      if (parsed.Sitzung) {
        setSessionItems(sessionObjectToArray(parsed.Sitzung));
      } else {
        setSessionItems([]);
      }
    } catch (error) {
      alert("Fehler beim Lesen des YAMLs. Bitte Format prüfen.");
      console.error(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      processYamlContent(event.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return alert("Zwischenablage ist leer!");
      processYamlContent(text);
    } catch (err) {
      console.error(err);
      alert("Clipboard Zugriff verweigert.");
    }
  };

  const handleExport = () => {
    const dataToExport = {
      FSR: fsrMembers,
      Protokollant: protocolant[0] || "",
      WeiterePersonen: guests,
      Date: meta.Date,
      Start: meta.Start,
      Ende: meta.Ende,
      Sitzung: sessionArrayToObject(sessionItems),
    };

    const yamlString = yaml.dump(dataToExport, {
      lineWidth: -1,
      noRefs: true,
      replacer: (_key, value) => (value === null ? "" : value),
    });

    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Protokoll_${meta.Date || "Export"}.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  
  const addTopic = () => {
    setSessionItems([
      ...sessionItems,
      { id: `new-${Date.now()}`, topic: "Neues Thema", points: [""] },
    ]);
  };

  const updateTopicTitle = (id: string, newTitle: string) => {
    setSessionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, topic: newTitle } : item))
    );
  };

  const removeTopic = (id: string) => {
    setSessionItems((items) => items.filter((item) => item.id !== id));
  };

  const addPoint = (topicId: string) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) return { ...item, points: [...item.points, ""] };
        return item;
      })
    );
  };

  const updatePoint = (topicId: string, pointIndex: number, val: string) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) {
          const newPoints = [...item.points];
          newPoints[pointIndex] = val;
          return { ...item, points: newPoints };
        }
        return item;
      })
    );
  };

  const removePoint = (topicId: string, pointIndex: number) => {
    setSessionItems((items) =>
      items.map((item) => {
        if (item.id === topicId) {
          const newPoints = item.points.filter((_, idx) => idx !== pointIndex);
          return { ...item, points: newPoints };
        }
        return item;
      })
    );
  };

  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSessionItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              FSR Protokoll Editor
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Clipboard size={16} /> <span className="hidden sm:inline">Clipboard</span>
            </button>
            <input
              type="file"
              accept=".yaml,.yml"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Upload size={16} /> <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Save size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Meta Data Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2 space-y-5">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users size={16} /> Anwesenheit
            </h2>
            <TagInput
              label="FSR Mitglieder (Gewählt)"
              selected={fsrMembers}
              setSelected={setFsrMembers}
              suggestions={ENV_FSR_MEMBERS}
            />
            <TagInput
              label="Weitere Personen (Assoziierte / Gäste)"
              selected={guests}
              setSelected={setGuests}
              suggestions={ENV_ASSOC_MEMBERS}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar size={16} /> Details
            </h2>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={meta.Date}
                onChange={(e) => setMeta({ ...meta, Date: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Start{" "}
                  <button
                    className="text-indigo-600 font-medium hover:text-indigo-800"
                    onClick={() =>
                      setMeta({
                        ...meta,
                        Start: new Date().toISOString().slice(11, 19),
                      })
                    }
                  >
                    jetzt
                  </button>
                </label>
                <input
                  type="time"
                  step="1"
                  value={meta.Start}
                  onChange={(e) => setMeta({ ...meta, Start: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Ende{" "}
                  <button
                    className="text-indigo-600 font-medium hover:text-indigo-800"
                    onClick={() =>
                      setMeta({
                        ...meta,
                        Ende: new Date().toISOString().slice(11, 19),
                      })
                    }
                  >
                    jetzt
                  </button>
                </label>
                <input
                  type="time"
                  step="1"
                  value={meta.Ende}
                  onChange={(e) => setMeta({ ...meta, Ende: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Protokollant:in
              </label>
              <TagInput
                label=""
                selected={protocolant}
                setSelected={setProtocolant}
                suggestions={ENV_FSR_MEMBERS}
                maxSelections={1}
              />
            </div>
          </div>
        </section>

        {/* Meeting Content */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Sitzungsinhalte
            </h2>
            <button
              onClick={addTopic}
              className="flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-800"
            >
              <Plus size={16} /> Neues Thema
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-6">
              <SortableContext
                items={sessionItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {sessionItems.map((item) => (
                  <SortableSessionItem
                    key={item.id}
                    item={item}
                    updateTopicTitle={updateTopicTitle}
                    removeTopic={removeTopic}
                    addPoint={addPoint}
                    updatePoint={updatePoint}
                    removePoint={removePoint}
                  />
                ))}
              </SortableContext>

              {sessionItems.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                  <p>
                    Keine Themen vorhanden. Füge ein Thema hinzu oder importiere
                    ein Protokoll.
                  </p>
                </div>
              )}
            </div>
          </DndContext>
        </section>
      </main>
    </div>
  );
}