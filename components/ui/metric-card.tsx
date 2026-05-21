import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "lagoon",
  children,
  className
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "lagoon" | "matcha" | "saffron" | "coral" | "berry";
  children?: React.ReactNode;
  className?: string;
}) {
  const toneClass = {
    lagoon: "bg-lagoon/14 text-lagoon",
    matcha: "bg-matcha/16 text-matcha",
    saffron: "bg-saffron/16 text-saffron",
    coral: "bg-coral/14 text-coral",
    berry: "bg-berry/14 text-berry"
  }[tone];

  return (
    <section className={cn("glass-panel rounded-lg p-4 animate-slide-up", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-black/55 dark:text-white/55">{label}</p>
          <p className="mt-1 truncate text-2xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", toneClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {detail ? <p className="mt-2 text-sm text-black/55 dark:text-white/55">{detail}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
