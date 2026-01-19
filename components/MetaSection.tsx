import React from "react";
import { Users, Calendar } from "lucide-react";
import { TagInput } from "./TagInput";
import { Member } from "@/common/types";

interface MetaSectionProps {
  fsrMembers: string[];
  setFsrMembers: (val: string[]) => void;
  availableFsrMembers: Member[];
  guests: string[];
  setGuests: (val: string[]) => void;
  availableAssocMembers: Member[];
  protocolant: string[];
  setProtocolant: (val: string[]) => void;
  meta: { Date: string; Start: string; Ende: string };
  setMeta: (val: { Date: string; Start: string; Ende: string }) => void;
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
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 col-span-2 space-y-5 dark:shadow-slate-700">
        <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
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
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 space-y-4 dark:shadow-slate-700">
        <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={16} /> Details
        </h2>
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Datum
          </label>
          <input
            type="date"
            value={meta.Date}
            onChange={(e) => setMeta({ ...meta, Date: e.target.value })}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Start{" "}
              <button
                type="button"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
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
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              Ende{" "}
              <button
                type="button"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
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
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
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
            suggestions={availableFsrMembers}
            maxSelections={1}
          />
        </div>
      </div>
    </section>
  );
};
