"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "text-accent-contrast bg-accent hover:bg-accent-strong border border-accent shadow-md shadow-accent/20",
  secondary: "text-text bg-surface-2 hover:bg-surface border border-border-strong shadow-sm",
  outline: "text-text bg-surface/50 hover:bg-surface-2 border border-border-strong shadow-sm",
  ghost: "text-text-muted hover:text-text bg-transparent hover:bg-surface-2 border border-transparent",
  danger: "text-white bg-danger hover:opacity-90 border border-danger shadow-md shadow-danger/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium",
  md: "text-xs font-mono font-bold px-4 py-2.5 rounded-xl gap-2",
  lg: "text-sm font-mono font-bold px-6 py-3.5 rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 ease-out active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
