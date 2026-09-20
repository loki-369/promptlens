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
  primary: "text-white bg-accent hover:bg-accent-strong border border-accent font-semibold shadow-sm active:translate-y-0.5",
  secondary: "text-text bg-surface-2 hover:bg-surface border border-border-strong font-medium shadow-sm active:translate-y-0.5",
  outline: "text-text bg-surface hover:bg-surface-2 border border-border-strong font-medium shadow-sm active:translate-y-0.5",
  ghost: "text-text-muted hover:text-text bg-transparent hover:bg-surface-2 border border-transparent font-medium",
  danger: "text-white bg-danger hover:opacity-90 border border-danger font-semibold shadow-sm active:translate-y-0.5",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5 font-sans",
  md: "text-xs font-mono font-semibold px-4.5 py-2.5 rounded-xl gap-2 tracking-wide uppercase",
  lg: "text-sm font-mono font-bold px-6 py-3.5 rounded-xl gap-2.5 tracking-wide uppercase",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 ease-out disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer select-none",
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

