import { Camera, Droplets, Scale, ShieldCheck, TrendingDown } from "lucide-react";
import { WeightTrendChart } from "@/components/charts/weight-trend-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { weightTrend } from "@/lib/data/mock";

export default function WeightPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Body trend"
        title="Weight"
        description="Daily logging is noisy. CutMode highlights weekly averages, water retention, and lean mass preservation."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Current weight" value="84.2 kg" detail="-1.2 kg from start" icon={Scale} tone="lagoon" />
        <MetricCard label="Weekly average" value="84.3 kg" detail="-0.6 kg over 7 days" icon={TrendingDown} tone="matcha" />
        <MetricCard label="Body fat trend" value="23.0%" detail="Estimated from logs" icon={Droplets} tone="saffron" />
        <MetricCard label="Lean mass signal" value="Stable" detail="Protein and training are supporting retention" icon={ShieldCheck} tone="berry" />
      </div>

      <section className="glass-panel rounded-lg p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label">Trend graph</p>
            <h2 className="mt-2 text-2xl font-semibold">Daily weight vs weekly average</h2>
          </div>
          <span className="rounded-full bg-saffron/14 px-3 py-1 text-xs font-semibold text-saffron">Water retention aware</span>
        </div>
        <WeightTrendChart data={weightTrend} />
      </section>

      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <section className="surface p-5">
          <p className="label">Log weight</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="field" placeholder="Weight kg" type="number" step="0.1" />
            <input className="field" placeholder="Body fat %, optional" type="number" step="0.1" />
          </div>
          <textarea className="field mt-3 min-h-24" placeholder="Sleep, soreness, sodium, cycle, stress..." />
          <button className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-paper dark:text-ink">
            Save weight
          </button>
        </section>

        <section className="surface p-5">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-lagoon" />
            <p className="font-semibold">Progress photos and measurements</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input className="field" placeholder="Waist cm" />
            <input className="field" placeholder="Chest cm" />
            <input className="field" placeholder="Hip cm" />
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-black/15 p-6 text-center text-sm text-black/55 dark:border-white/15 dark:text-white/55">
            Drop progress photos here for secure Cloudinary storage.
          </div>
        </section>
      </div>
    </div>
  );
}
