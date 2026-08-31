"use client";

import React from "react";
import { AtSign, FilePlus2, ListChecks, Plus, Terminal } from "lucide-react";
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
import { Member } from "@/common/types";
import {
  Badge,
  Button,
  SectionHeading,
  Surface,
} from "@/components/ui/Primitives";

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

  const pointCount = React.useMemo(
    () => sessionItems.reduce((total, item) => total + item.points.length, 0),
    [sessionItems]
  );

  return (
    <div className="min-h-screen pb-20 text-foreground">
      <Header
        handlePasteFromClipboard={handlePasteFromClipboard}
        fileInputRef={fileInputRef}
        handleFileUpload={handleFileUpload}
        handleImportFileClick={handleImportFileClick}
        handleExport={handleExport}
        handleSendToDiscord={handleSendToDiscord}
        resetProtocol={resetProtocol}
      />

      <main className="mx-auto grid max-w-[1640px] grid-cols-1 gap-6 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8 lg:px-8">
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

        <section className="min-w-0">
          <Surface className="mb-5 overflow-hidden">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <SectionHeading
                eyebrow="Arbeitsbereich"
                title="Sitzungsinhalte"
                description="Themen ordnen, Beschlüsse festhalten und das fertige Protokoll direkt weitergeben."
              />
              <Button onClick={addTopic} variant="primary" className="self-start sm:self-auto">
                <Plus size={17} /> Neues Thema
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border bg-[color:var(--muted)]/45 px-5 py-3 sm:px-6">
              <Badge tone={sessionItems.length ? "accent" : "neutral"}>
                <ListChecks size={13} className="mr-1.5" />
                {sessionItems.length} {sessionItems.length === 1 ? "Thema" : "Themen"}
              </Badge>
              <Badge>{pointCount} Punkte</Badge>
              <span className="ml-auto hidden items-center gap-3 text-xs font-medium text-muted-foreground md:flex">
                <span className="flex items-center gap-1">
                  <AtSign size={13} /> Personen erwähnen
                </span>
                <span className="flex items-center gap-1">
                  <Terminal size={13} /> Befehle einfügen
                </span>
              </span>
            </div>
          </Surface>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-4" aria-live="polite">
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
                <Surface className="border-dashed p-8 text-center sm:p-14">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-accent text-accent-foreground">
                    <FilePlus2 size={28} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-[-0.02em]">
                    Bereit für die Sitzung
                  </h3>
                  <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Lege das erste Thema an oder importiere ein vorhandenes YAML-Protokoll über die Werkzeugleiste.
                  </p>
                  <Button onClick={addTopic} variant="primary" className="mt-5">
                    <Plus size={17} /> Erstes Thema anlegen
                  </Button>
                </Surface>
              )}
            </div>
          </DndContext>
        </section>
      </main>
    </div>
  );
}
