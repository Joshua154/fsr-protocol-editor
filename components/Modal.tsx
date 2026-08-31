"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "md",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      const previousFocus = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => modalRef.current?.focus());

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = previousOverflow;
        previousFocus?.focus();
      };
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`glass-popover materialize flex w-full ${widthClasses[width]} max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[var(--radius-card)] outline-none`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border bg-[color:var(--muted)]/40 px-5 py-4">
          <h3 id={titleId} className="text-lg font-bold tracking-[-0.02em] text-foreground">
            {title}
          </h3>
          <Button
            onClick={onClose}
            variant="quiet"
            size="icon"
            aria-label="Dialog schließen"
            className="-mr-2"
          >
            <X size={18} />
          </Button>
        </div>
        <div className="overflow-y-auto p-5 subtle-scrollbar sm:p-6">{children}</div>
      </div>
    </div>
  );
};
