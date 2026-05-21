import { cn, toPercent } from "@/lib/utils";

const tones = {
  lagoon: "bg-lagoon",
  matcha: "bg-matcha",
  saffron: "bg-saffron",
  coral: "bg-coral",
  berry: "bg-berry"
};

export function ProgressBar({
  value,
  target,
  tone = "lagoon",
  label
}: {
  value: number;
  target: number;
  tone?: keyof typeof tones;
  label?: string;
}) {
  const percent = toPercent(value, target);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs text-black/55 dark:text-white/55">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      ) : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-black/8 dark:bg-white/10">
        <div
          className={cn("h-full rounded-full transition-all duration-500", tones[tone])}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
