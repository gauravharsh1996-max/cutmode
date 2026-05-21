import { Award, CalendarDays, Flame, LineChart, Salad, Trophy } from "lucide-react";
import { NutritionTrendChart } from "@/components/charts/nutrition-trend-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { achievements, analyticsTrend, dashboardSummary } from "@/lib/data/mock";

export default function AnalyticsPage() {
  const averageDeficit = Math.round(
    analyticsTrend.reduce((sum, day) => sum + day.deficit, 0) / analyticsTrend.length
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Progress intelligence"
        description="Calories, protein, workouts, deficit history, strongest fat-loss days, and weekly report signals."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Average deficit" value={`${averageDeficit} kcal`} detail="Rolling 10-day daily average" icon={Flame} tone="lagoon" />
        <MetricCard label="Weekly deficit" value="3,430 kcal" detail="Projected 0.45 kg fat loss" icon={LineChart} tone="matcha" />
        <MetricCard label="Workout consistency" value="5 / 7" detail="Sessions completed" icon={CalendarDays} tone="saffron" />
        <MetricCard label="Strongest day" value="1,240 kcal" detail="Best deficit this cycle" icon={Trophy} tone="berry" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass-panel rounded-lg p-5">
          <p className="label">Calories</p>
          <h2 className="mt-2 text-2xl font-semibold">Calorie trend</h2>
          <NutritionTrendChart data={analyticsTrend} mode="calories" />
        </section>
        <section className="glass-panel rounded-lg p-5">
          <p className="label">Protein</p>
          <h2 className="mt-2 text-2xl font-semibold">Muscle preservation trend</h2>
          <NutritionTrendChart data={analyticsTrend} mode="protein" />
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <section className="surface p-5">
          <p className="label">Weekly progress report</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white/70 p-4 dark:bg-white/[0.07]">
              <p className="text-sm text-black/55 dark:text-white/55">10-day deficit</p>
              <p className="mt-1 text-2xl font-semibold">{dashboardSummary.tenDay.rollingDeficit} kcal</p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 dark:bg-white/[0.07]">
              <p className="text-sm text-black/55 dark:text-white/55">Estimated fat loss</p>
              <p className="mt-1 text-2xl font-semibold">{dashboardSummary.tenDay.estimatedFatLossKg} kg</p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 dark:bg-white/[0.07]">
              <p className="text-sm text-black/55 dark:text-white/55">Protein adherence</p>
              <p className="mt-1 text-2xl font-semibold">72%</p>
            </div>
          </div>
          <a href="/api/reports?format=pdf" className="mt-4 inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-paper dark:text-ink">
            Export PDF
          </a>
        </section>

        <section className="surface p-5">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-saffron" />
            <p className="font-semibold">Achievements</p>
          </div>
          <div className="mt-4 space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="rounded-lg bg-white/70 p-3 dark:bg-white/[0.07]">
                <div className="flex items-start gap-2">
                  <Salad className="mt-0.5 h-4 w-4 shrink-0 text-matcha" />
                  <div>
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="mt-1 text-sm text-black/55 dark:text-white/55">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
