import React from "react";
import {
  Clipboard,
  Download,
  FileText,
  RotateCcw,
  Send,
  Upload,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Primitives";

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
    <header className="print:hidden sticky top-0 z-40 border-b border-[var(--glass-border)] bg-[color:var(--card)]/90 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1640px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(53,104,232,.25)]">
            <FileText size={19} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-primary">
              FSR Informatik
            </p>
            <h1 className="truncate text-base font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-lg">
              Protokoll Editor
            </h1>
          </div>
        </div>

        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto py-0.5 subtle-scrollbar">
          <ThemeToggle />
          <Button
            onClick={resetProtocol}
            variant="quiet"
            size="icon"
            aria-label="Protokoll zurücksetzen"
            title="Protokoll zurücksetzen"
            className="text-destructive hover:bg-[var(--destructive-soft)] hover:text-destructive"
          >
            <RotateCcw size={17} />
          </Button>
          <Button
            onClick={handlePasteFromClipboard}
            variant="secondary"
            size="sm"
            title="Aus der Zwischenablage einfügen"
          >
            <Clipboard size={16} />
            <span className="hidden md:inline">Einfügen</span>
          </Button>
          <input
            type="file"
            accept=".yaml,.yml"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            onClick={handleImportFileClick}
            variant="secondary"
            size="sm"
            title="YAML-Datei importieren"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button
            onClick={handleExport}
            variant="secondary"
            size="sm"
            title="Als YAML-Datei exportieren"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={handleSendToDiscord}
            variant="primary"
            size="sm"
            title="Protokoll an Discord senden"
          >
            <Send size={16} />
            <span className="hidden sm:inline">An Discord</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
