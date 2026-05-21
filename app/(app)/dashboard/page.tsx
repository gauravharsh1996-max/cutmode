import { Activity, Apple, Flame, Target, Utensils } from "lucide-react";
import { DeficitCard } from "@/components/dashboard/deficit-card";
import { NutritionTrendChart } from "@/components/charts/nutrition-trend-chart";
import { MacroDonut } from "@/components/charts/macro-donut";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { analyticsTrend, dashboardSummary, mealsToday, mockGoal } from "@/lib/data/mock";
import { formatGrams, formatKcal } from "@/lib/utils";

export default function DashboardPage() {
  const { today, deficit, tenDay, remainingCalories, remainingProtein, statuses, waterWarning } = dashboardSummary;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Today"
        title="Dashboard"
        description="Calories, protein, workouts, and deficit progress in one clean loop."
        actions={
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <StatusPill key={status} label={status} />
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Calories consumed" value={formatKcal(today.calories)} detail={`${formatKcal(remainingCalories)} remaining`} icon={Utensils} tone="coral">
          <ProgressBar value={today.calories} target={mockGoal.calorieTarget} tone="coral" label={`Target ${formatKcal(mockGoal.calorieTarget)}`} />
        </MetricCard>
        <MetricCard label="Protein" value={formatGrams(today.protein)} detail={`${Math.max(Math.round(remainingProtein), 0)}g left to protect muscle`} icon={Apple} tone="matcha">
          <ProgressBar value={today.protein} target={mockGoal.proteinTarget} tone="matcha" label={`Target ${mockGoal.proteinTarget}g`} />
        </MetricCard>
        <MetricCard label="Current deficit" value={formatKcal(deficit)} detail="Includes workout calories burned" icon={Flame} tone="lagoon">
          <ProgressBar value={deficit} target={500} tone="lagoon" label="Daily pace" />
        </MetricCard>
        <MetricCard label="Maintenance" value={formatKcal(mockGoal.maintenanceCalories)} detail="Dynamic target can update from profile data" icon={Target} tone="saffron">
          <ProgressBar value={mockGoal.calorieTarget} target={mockGoal.maintenanceCalories} tone="saffron" label="Diet calories vs maintenance" />
        </MetricCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <DeficitCard
          rollingDeficit={tenDay.rollingDeficit}
          target={mockGoal.tenDayDeficitGoal}
          progressPercent={tenDay.progressPercent}
          estimatedFatLossKg={tenDay.estimatedFatLossKg}
          message={tenDay.message}
        />

        <section className="glass-panel rounded-lg p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="label">Macro split today</p>
              <h2 className="mt-2 text-2xl font-semibold">Protein first</h2>
              <p className="mt-1 text-sm text-black/58 dark:text-white/58">Macro calories from logged meals.</p>
            </div>
            <Activity className="h-5 w-5 text-lagoon" />
          </div>
          <MacroDonut protein={today.protein} carbs={today.carbs} fats={today.fats} />
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-matcha/12 p-2 text-matcha">{Math.round(today.protein)}g protein</div>
            <div className="rounded-lg bg-saffron/12 p-2 text-saffron">{Math.round(today.carbs)}g carbs</div>
            <div className="rounded-lg bg-coral/12 p-2 text-coral">{Math.round(today.fats)}g fats</div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <section className="glass-panel rounded-lg p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Trend</p>
              <h2 className="mt-2 text-2xl font-semibold">Deficit history</h2>
            </div>
            <StatusPill label="Great Deficit Day" />
          </div>
          <NutritionTrendChart data={analyticsTrend} mode="deficit" />
        </section>

        <section className="surface p-5">
          <p className="label">Meals today</p>
          <div className="mt-4 space-y-3">
            {mealsToday.map((meal) => (
              <div key={meal.id} className="rounded-lg bg-white/70 p-3 dark:bg-white/[0.07]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{meal.name}</p>
                    <p className="mt-1 text-xs text-black/52 dark:text-white/52">
                      {meal.time} - {meal.source} - {Math.round(meal.confidence * 100)}% confidence
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{meal.calories} kcal</p>
                </div>
                <p className="mt-2 text-xs text-black/55 dark:text-white/55">{meal.protein}g protein</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {waterWarning ? (
        <section className="rounded-lg border border-saffron/20 bg-saffron/12 p-4 text-sm text-black/72 dark:text-white/72">
          <span className="font-semibold text-saffron">Water retention note:</span> {waterWarning}
        </section>
      ) : null}
    </div>
  );
}
