"use client";

import React from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useProtocol } from "@/hooks/useProtocol";
import { Header } from "@/components/Header";
import { MetaSection } from "@/components/MetaSection";
import { SortableSessionItem } from "@/components/SortableSessionItem";

interface ProtocolEditorProps {
  availableFsrMembers: string[];
  availableAssocMembers: string[];
}

export function ProtocolEditor({
  availableFsrMembers,
  availableAssocMembers,
}: ProtocolEditorProps) {
  const {
    fsrMembers,
    setFsrMembers,
    guests,
    setGuests,
    protocolant,
    setProtocolant,
    meta,
    setMeta,
    sessionItems,
    fileInputRef,
    handleFileUpload,
    handlePasteFromClipboard,
    handleExport,
    addTopic,
    updateTopicTitle,
    removeTopic,
    addPoint,
    updatePoint,
    removePoint,
    handleDragEnd,
  } = useProtocol();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-20">
      <Header
        handlePasteFromClipboard={handlePasteFromClipboard}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        handleExport={handleExport}
      />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <MetaSection
          fsrMembers={fsrMembers}
          setFsrMembers={setFsrMembers}
          guests={guests}
          setGuests={setGuests}
          protocolant={protocolant}
          setProtocolant={setProtocolant}
          meta={meta}
          setMeta={setMeta}
          availableFsrMembers={availableFsrMembers}
          availableAssocMembers={availableAssocMembers}
        />

        {/* Meeting Content */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Sitzungsinhalte
            </h2>
            <button
              onClick={addTopic}
              className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
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
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
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
