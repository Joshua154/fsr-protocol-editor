import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { classNames } from "@/components/ui/classNames";
import styles from "./Button.module.css";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "suggestion"
  | "dangerSoft"
  | "destructive";

export type AppButtonSize = "sm" | "md" | "icon" | "inlineIcon";

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  children: ReactNode;
}

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(function AppButton(
  {
    variant = "secondary",
    size = "md",
    type = "button",
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      data-variant={variant}
      data-size={size}
      className={classNames(styles.button, className)}
      {...props}
    >
      {children}
    </button>
  );
});
