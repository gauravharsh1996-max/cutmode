import { cn } from "@/lib/utils";

const toneByLabel: Record<string, string> = {
  "On Track": "bg-matcha/15 text-matcha ring-matcha/20",
  "Slightly Over": "bg-saffron/15 text-saffron ring-saffron/25",
  "Protein Low": "bg-coral/15 text-coral ring-coral/20",
  "Great Deficit Day": "bg-lagoon/15 text-lagoon ring-lagoon/20",
  "Steady Day": "bg-berry/15 text-berry ring-berry/20"
};

export function StatusPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        toneByLabel[label] ?? "bg-black/5 text-black/65 ring-black/10 dark:bg-white/10 dark:text-white/70 dark:ring-white/10",
        className
      )}
    >
      {label}
    </span>
  );
}
