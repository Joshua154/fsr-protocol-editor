import React from "react";

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "quiet" | "destructive";
type ButtonSize = "sm" | "md" | "icon";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(53,104,232,.22)] hover:brightness-95",
  secondary:
    "control-surface text-secondary-foreground hover:border-[var(--border-strong)] hover:bg-[var(--card-strong)]",
  quiet:
    "border border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-muted hover:text-foreground",
  destructive:
    "border border-transparent bg-[var(--destructive-soft)] text-destructive shadow-none hover:brightness-95",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-9 gap-1.5 px-3",
  md: "gap-2 px-4",
  icon: "h-10 w-10 justify-center p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "ui-button focus-ring inline-flex items-center justify-center whitespace-nowrap",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export function Surface({
  className,
  children,
  as: Component = "section",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Component className={cn("glass-surface rounded-[var(--radius-card)]", className)}>
      {children}
    </Component>
  );
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Badge({
  className,
  children,
  tone = "neutral",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning";
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-[-0.01em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function FieldLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("mb-1.5 block text-sm font-semibold text-secondary-foreground", className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-1 text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
