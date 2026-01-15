import React from "react";
import { FileText, Clipboard, Upload, Save } from "lucide-react";

interface HeaderProps {
  handlePasteFromClipboard: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExport: () => void;
}

export const Header = ({
  handlePasteFromClipboard,
  fileInputRef,
  handleFileUpload,
  handleExport,
}: HeaderProps) => {
  return (
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
            <Clipboard size={16} />{" "}
            <span className="hidden sm:inline">Clipboard</span>
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
  );
};
