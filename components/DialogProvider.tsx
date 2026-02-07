"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "@/components/Modal";

type DialogType = "alert" | "confirm" | "prompt";

interface DialogOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

interface DialogOptionsPrompt extends DialogOptions {
  hiddenInput?: boolean;
}

type ConfirmResult = boolean;
type AlertResult = void;
type PromptResult = string | null;
type DialogResult = ConfirmResult | AlertResult | PromptResult;

interface DialogContextType {
  confirm: (message: string, options?: DialogOptions) => Promise<DialogResult>;
  alert: (message: string, options?: DialogOptions) => Promise<DialogResult>;
  prompt: (message: string, options?: DialogOptionsPrompt) => Promise<DialogResult>;
}

const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

interface DialogState {
  isOpen: boolean;
  type: DialogType;
  message: string;
  options: DialogOptions;
  resolve: (value: boolean | string | null | void) => void;
}

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [inputValue, setInputValue] = useState("");

  const showDialog = useCallback(
    (type: DialogType, message: string, options: DialogOptions = {}) => {
      return new Promise<boolean | string | null | void>((resolve) => {
        setDialog({
          isOpen: true,
          type,
          message,
          options,
          resolve,
        });
        if (type === "prompt" && options.defaultValue) {
          setInputValue(options.defaultValue);
        } else {
          setInputValue("");
        }
      });
    },
    []
  );

  const confirm = useCallback(
    (message: string, options?: DialogOptions) => {
      return showDialog("confirm", message, {
        title: "Bestätigen",
        confirmText: "Ja",
        cancelText: "Abbrechen",
        ...options,
      });
    },
    [showDialog]
  );

  const alert = useCallback(
    (message: string, options?: DialogOptions) => {
      return showDialog("alert", message, {
        title: "Hinweis",
        confirmText: "OK",
        ...options,
      });
    },
    [showDialog]
  );

  const prompt = useCallback(
    (message: string, options?: DialogOptions) => {
      return showDialog("prompt", message, {
        title: "Eingabe",
        confirmText: "OK",
        cancelText: "Abbrechen",
        ...options,
      });
    },
    [showDialog]
  );

  const handleClose = () => {
    if (dialog) {
      if (dialog.type === "confirm") dialog.resolve(false);
      if (dialog.type === "prompt") dialog.resolve(null);
      if (dialog.type === "alert") dialog.resolve(undefined);
      setDialog(null);
    }
  };

  const handleConfirm = () => {
    if (dialog) {
      if (dialog.type === "confirm") dialog.resolve(true);
      if (dialog.type === "prompt") dialog.resolve(inputValue);
      if (dialog.type === "alert") dialog.resolve(undefined);
      setDialog(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && dialog?.type !== "alert") {
      handleConfirm();
    }
  };

  return (
    <DialogContext.Provider value={{ confirm, alert, prompt }}>
      {children}
      {dialog && (
        <Modal
          isOpen={dialog.isOpen}
          onClose={handleClose}
          title={dialog.options.title}
          width="sm"
        >
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              {dialog.message}
            </p>

            {dialog.type === "prompt" && (
              <input
                type={(dialog.options as DialogOptionsPrompt).hiddenInput ? "password" : "text"}
                autoFocus
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dialog.options.placeholder}
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              {dialog.type !== "alert" && (
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  {dialog.options.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors ${
                  dialog.options.destructive
                    ? "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                    : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                }`}
              >
                {dialog.options.confirmText}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DialogContext.Provider>
  );
};
