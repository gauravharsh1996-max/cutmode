"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-graphite dark:bg-paper dark:text-ink dark:hover:bg-white",
  secondary:
    "border border-black/10 bg-white/70 text-ink hover:bg-white dark:border-white/10 dark:bg-white/[0.08] dark:text-paper dark:hover:bg-white/[0.12]",
  ghost: "text-ink hover:bg-black/5 dark:text-paper dark:hover:bg-white/10",
  danger: "bg-coral text-white hover:bg-coral/90"
};

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
