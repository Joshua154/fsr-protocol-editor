import React from "react";
import { FileText, Clipboard, Upload, Save, RotateCcw, Send } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AppButton } from "@/components/ui";

interface HeaderProps {
  handlePasteFromClipboard: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportFileClick: () => void;
  handleExport: () => void;
  handleSendToDiscord: () => void;
  resetProtocol: () => void;
}

export const Header = ({
  handlePasteFromClipboard,
  fileInputRef,
  handleFileUpload,
  handleImportFileClick,
  handleExport,
  handleSendToDiscord,
  resetProtocol,
}: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-background border-b border-slate-200 dark:border-border sticky top-0 z-10 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg text-white">
            <FileText size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-foreground">
            FSR Protokoll Editor
          </h1>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <AppButton
            onClick={resetProtocol}
            variant="dangerSoft"
            title="Protokoll zurücksetzen"
          >
            <RotateCcw size={16} /> <span className="hidden sm:inline">Reset</span>
          </AppButton>
          <AppButton
            onClick={handlePasteFromClipboard}
            variant="outline"
          >
            <Clipboard size={16} />{" "}
            <span className="hidden sm:inline">Clipboard</span>
          </AppButton>
          <input
            type="file"
            accept=".yaml,.yml"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <AppButton
            onClick={handleImportFileClick}
            variant="secondary"
          >
            <Upload size={16} /> <span className="hidden sm:inline">Import</span>
          </AppButton>
          <AppButton
            onClick={handleExport}
            variant="primary"
          >
            <Save size={16} /> <span className="hidden sm:inline">Export</span>
          </AppButton>
          <AppButton
            onClick={handleSendToDiscord}
            variant="primary"
            title="An Discord senden"
          >
            <Send size={16} /> <span className="hidden sm:inline">Discord</span>
          </AppButton>
        </div>
      </div>
    </header>
  );
};
