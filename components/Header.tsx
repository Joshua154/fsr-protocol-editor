import React from "react";
import { FileText, Clipboard, Upload, Save, RotateCcw } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  handlePasteFromClipboard: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportFileClick: () => void;
  handleExport: () => void;
  resetProtocol: () => void;
}

export const Header = ({
  handlePasteFromClipboard,
  fileInputRef,
  handleFileUpload,
  handleImportFileClick,
  handleExport,
  resetProtocol,
}: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg text-white">
            <FileText size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            FSR Protokoll Editor
          </h1>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <button
            onClick={resetProtocol}
            className="flex items-center gap-2 px-4 py-2 text-md font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-transparent rounded-lg transition-colors"
            title="Protokoll zurücksetzen"
          >
            <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-2 px-4 py-2 text-md font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
            onClick={handleImportFileClick}
            className="flex items-center gap-2 px-4 py-2 text-md font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Upload size={16} /> <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-md font-medium text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-colors"
          >
            <Save size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
