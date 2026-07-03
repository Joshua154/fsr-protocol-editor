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
import { AppButton } from "@/components/ui";
import { Member } from "@/common/types";

interface ProtocolEditorProps {
  availableFsrMembers: Member[];
  availableAssocMembers: Member[];
  defaultStartTime?: string;
  defaultLocation?: string;
  defaultRoom?: string;
}

export function ProtocolEditor({
  availableFsrMembers,
  availableAssocMembers,
  defaultStartTime,
  defaultLocation,
  defaultRoom,
}: ProtocolEditorProps) {
  const memberSuggestions = React.useMemo(
    () => [...availableFsrMembers, ...availableAssocMembers],
    [availableFsrMembers, availableAssocMembers]
  );
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
    handleImportFileClick,
    handlePasteFromClipboard,
    handleExport,
    handleSendToDiscord,
    addTopic,
    updateTopicTitle,
    removeTopic,
    addPoint,
    updatePoint,
    removePoint,
    handleDragEnd,
    resetProtocol,
  } = useProtocol({ defaultStartTime, defaultLocation, defaultRoom });

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
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground font-sans pb-20">
      <Header
        handlePasteFromClipboard={handlePasteFromClipboard}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        handleImportFileClick={handleImportFileClick}
        handleExport={handleExport}
        handleSendToDiscord={handleSendToDiscord}
        resetProtocol={resetProtocol}
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
            <h2 className="text-xl font-bold text-slate-800 dark:text-foreground">
              Sitzungsinhalte
            </h2>
            <AppButton
              onClick={addTopic}
              variant="link"
              size="sm"
            >
              <Plus size={16} /> Neues Thema
            </AppButton>
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
                    memberSuggestions={memberSuggestions}
                    updateTopicTitle={updateTopicTitle}
                    removeTopic={removeTopic}
                    addPoint={addPoint}
                    updatePoint={updatePoint}
                    removePoint={removePoint}
                  />
                ))}
              </SortableContext>

              {sessionItems.length === 0 && (
                <div className="text-center py-12 bg-slate-50 dark:bg-zinc-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-border text-slate-400 dark:text-muted-foreground">
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
