import React from "react";
import { Users, Calendar } from "lucide-react";
import { TagInput } from "./TagInput";
import { ENV_FSR_MEMBERS, ENV_ASSOC_MEMBERS } from "@/common/constants";

interface MetaSectionProps {
  fsrMembers: string[];
  setFsrMembers: (val: string[]) => void;
  guests: string[];
  setGuests: (val: string[]) => void;
  protocolant: string[];
  setProtocolant: (val: string[]) => void;
  meta: { Date: string; Start: string; Ende: string };
  setMeta: (val: { Date: string; Start: string; Ende: string }) => void;
}

export const MetaSection = ({
  fsrMembers,
  setFsrMembers,
  guests,
  setGuests,
  protocolant,
  setProtocolant,
  meta,
  setMeta,
}: MetaSectionProps) => {
  return (
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
  );
};
