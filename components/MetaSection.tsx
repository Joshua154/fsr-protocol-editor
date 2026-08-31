import React from "react";
import { CalendarDays, Clock3, MapPin, PenLine, Users } from "lucide-react";
import { TagInput } from "./TagInput";
import { Member } from "@/common/types";
import { Button, Eyebrow, FieldLabel, Surface } from "@/components/ui/Primitives";

interface MetaSectionProps {
  fsrMembers: string[];
  setFsrMembers: (val: string[]) => void;
  availableFsrMembers: Member[];
  guests: string[];
  setGuests: (val: string[]) => void;
  availableAssocMembers: Member[];
  protocolant: string[];
  setProtocolant: (val: string[]) => void;
  meta: {
    Date: string;
    Start: string;
    Ende: string;
    Location: string;
    Room: string;
  };
  setMeta: (val: {
    Date: string;
    Start: string;
    Ende: string;
    Location: string;
    Room: string;
  }) => void;
}

const getCurrentTimeString = (): string => {
  const now = new Date();
  return [now.getHours(), now.getMinutes()]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
};

function PanelTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        {icon}
      </div>
      <div>
        <h2 className="font-bold leading-tight tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="ui-input"
      />
    </label>
  );
}

export const MetaSection = ({
  fsrMembers,
  setFsrMembers,
  availableFsrMembers,
  guests,
  setGuests,
  availableAssocMembers,
  protocolant,
  setProtocolant,
  meta,
  setMeta,
}: MetaSectionProps) => {
  return (
    <aside className="space-y-4 lg:sticky lg:top-[5.75rem] lg:self-start">
      <div className="px-1 pb-1">
        <Eyebrow>Vorbereitung</Eyebrow>
        <h2 className="mt-1 text-xl font-bold tracking-[-0.03em]">Sitzungsdaten</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Alle Angaben werden automatisch in diesem Browser gesichert.
        </p>
      </div>

      <Surface className="p-5">
        <PanelTitle
          icon={<Users size={17} />}
          title="Anwesenheit"
          description="Mitglieder, Gäste und Protokollführung"
        />
        <div className="space-y-4">
          <TagInput
            label="Gewählte Mitglieder"
            selected={fsrMembers}
            setSelected={setFsrMembers}
            suggestions={availableFsrMembers}
          />
          <TagInput
            label="Assoziierte & Gäste"
            selected={guests}
            setSelected={setGuests}
            suggestions={availableAssocMembers}
          />
          <TagInput
            label="Protokollant:in"
            selected={protocolant}
            setSelected={setProtocolant}
            suggestions={availableFsrMembers}
            maxSelections={1}
          />
        </div>
      </Surface>

      <Surface className="p-5">
        <PanelTitle
          icon={<CalendarDays size={17} />}
          title="Termin & Ort"
          description="Zeitlicher und räumlicher Rahmen"
        />
        <div className="space-y-4">
          <label className="block">
            <FieldLabel>Datum</FieldLabel>
            <input
              type="date"
              value={meta.Date}
              onChange={(event) => setMeta({ ...meta, Date: event.target.value })}
              className="ui-input font-mono text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            {(["Start", "Ende"] as const).map((field) => (
              <label className="block" key={field}>
                <span className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold text-secondary-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {field}
                  </span>
                  <Button
                    size="sm"
                    variant="quiet"
                    className="min-h-0 px-1 py-0 text-xs text-primary"
                    onClick={() =>
                      setMeta({ ...meta, [field]: getCurrentTimeString() })
                    }
                  >
                    jetzt
                  </Button>
                </span>
                <input
                  type="time"
                  value={meta[field]}
                  onChange={(event) =>
                    setMeta({ ...meta, [field]: event.target.value })
                  }
                  className="ui-input font-mono text-sm"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative">
              <div className="pointer-events-none absolute right-3 top-[2.55rem] text-muted-foreground">
                <MapPin size={15} />
              </div>
              <TextField
                label="Ort"
                value={meta.Location || ""}
                onChange={(Location) => setMeta({ ...meta, Location })}
                placeholder="z. B. Institut"
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute right-3 top-[2.55rem] text-muted-foreground">
                <PenLine size={15} />
              </div>
              <TextField
                label="Raum"
                value={meta.Room || ""}
                onChange={(Room) => setMeta({ ...meta, Room })}
                placeholder="z. B. 0.70"
              />
            </div>
          </div>
        </div>
      </Surface>
    </aside>
  );
};
