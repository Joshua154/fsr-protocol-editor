import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

import { classNames } from "@/components/ui/classNames";
import styles from "./Textarea.module.css";

export type AppTextareaVariant = "default" | "transparent";

export interface AppTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: AppTextareaVariant;
}

export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(
  function AppTextarea({ variant = "default", className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-variant={variant}
        className={classNames(styles.textarea, className)}
        {...props}
      />
    );
  }
);
