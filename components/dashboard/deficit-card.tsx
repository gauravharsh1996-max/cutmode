import { Activity } from "lucide-react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatKcal } from "@/lib/utils";

export function DeficitCard({
  rollingDeficit,
  target,
  progressPercent,
  estimatedFatLossKg,
  message
}: {
  rollingDeficit: number;
  target: number;
  progressPercent: number;
  estimatedFatLossKg: number;
  message: string;
}) {
  return (
    <section className="glass-panel rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label">Rolling 10-day deficit</p>
          <h2 className="mt-2 text-3xl font-semibold">{formatKcal(rollingDeficit)}</h2>
          <p className="mt-1 text-sm text-black/58 dark:text-white/58">Target: {formatKcal(target)}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-lagoon/14 text-lagoon">
          <Activity className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={progressPercent} target={100} tone="lagoon" label={`${progressPercent}% complete`} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-black/[0.035] p-3 dark:bg-white/[0.06]">
          <p className="text-xs text-black/50 dark:text-white/50">Estimated fat loss</p>
          <p className="mt-1 text-xl font-semibold">{estimatedFatLossKg} kg</p>
        </div>
        <div className="rounded-lg bg-black/[0.035] p-3 dark:bg-white/[0.06]">
          <p className="text-xs text-black/50 dark:text-white/50">Schedule signal</p>
          <p className="mt-1 text-sm font-semibold">{message}</p>
        </div>
      </div>
    </section>
  );
}
