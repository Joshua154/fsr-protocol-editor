import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { classNames } from "@/components/ui/classNames";
import styles from "./Input.module.css";

export type AppInputVariant = "default" | "transparent";

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: AppInputVariant;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(function AppInput(
  { variant = "default", className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      data-variant={variant}
      className={classNames(styles.input, className)}
      {...props}
    />
  );
});
