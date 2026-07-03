import React from "react";
import { Users, Calendar } from "lucide-react";
import { TagInput } from "./TagInput";
import { Member } from "@/common/types";
import { AppButton, AppInput } from "@/components/ui";

interface MetaSectionProps {
  fsrMembers: string[];
  setFsrMembers: (val: string[]) => void;
  availableFsrMembers: Member[];
  guests: string[];
  setGuests: (val: string[]) => void;
  availableAssocMembers: Member[];
  protocolant: string[];
  setProtocolant: (val: string[]) => void;
  meta: { Date: string; Start: string; Ende: string; Location: string; Room: string };
  setMeta: (val: { Date: string; Start: string; Ende: string; Location: string; Room: string }) => void;
}

const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
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
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md border border-slate-200 dark:border-border col-span-2 space-y-5 dark:shadow-none">
        <h2 className="text-md font-semibold text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
          <Users size={16} /> Anwesenheit
        </h2>
        <TagInput
          label="FSR Mitglieder (Gewählt)"
          selected={fsrMembers}
          setSelected={setFsrMembers}
          suggestions={availableFsrMembers}
        />
        <TagInput
          label="Weitere Personen (Assoziierte / Gäste)"
          selected={guests}
          setSelected={setGuests}
          suggestions={availableAssocMembers}
        />
      </div>
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-md border border-slate-200 dark:border-border space-y-4 dark:shadow-none">
        <h2 className="text-md font-semibold text-slate-400 dark:text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={16} /> Details
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
            Datum
          </label>
          <AppInput
            type="date"
            value={meta.Date}
            onChange={(e) => setMeta({ ...meta, Date: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
              Start{" "}
              <AppButton
                type="button"
                variant="link"
                onClick={() =>
                  setMeta({
                    ...meta,
                    Start: getCurrentTimeString(),
                  })
                }
              >
                jetzt
              </AppButton>
            </label>
            <AppInput
              type="time"
              step="1"
              value={meta.Start}
              onChange={(e) => setMeta({ ...meta, Start: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
              Ende{" "}
              <AppButton
                type="button"
                variant="link"
                onClick={() =>
                  setMeta({
                    ...meta,
                    Ende: getCurrentTimeString(),
                  })
                }
              >
                jetzt
              </AppButton>
            </label>
            <AppInput
              type="time"
              step="1"
              value={meta.Ende}
              onChange={(e) => setMeta({ ...meta, Ende: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
            Protokollant:in
          </label>
          <TagInput
            label=""
            selected={protocolant}
            setSelected={setProtocolant}
            suggestions={availableFsrMembers}
            maxSelections={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
            Ort
          </label>
          <AppInput
            type="text"
            value={meta.Location || ""}
            onChange={(e) => setMeta({ ...meta, Location: e.target.value })}
          />

          <label className="block text-sm font-medium text-slate-500 dark:text-muted-foreground mb-1">
            Raum
          </label>
          <AppInput
            type="text"
            value={meta.Room || ""}
            onChange={(e) => setMeta({ ...meta, Room: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
};
