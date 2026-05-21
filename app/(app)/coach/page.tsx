import { Bot, Brain, HeartPulse, Salad, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { buildCoachRecommendations } from "@/lib/ai/coach";
import { dashboardSummary, mockGoal } from "@/lib/data/mock";

export default function CoachPage() {
  const recommendations = buildCoachRecommendations({
    calories: dashboardSummary.today.calories,
    calorieTarget: mockGoal.calorieTarget,
    protein: dashboardSummary.today.protein,
    proteinTarget: mockGoal.proteinTarget,
    deficit: dashboardSummary.deficit,
    remainingCalories: dashboardSummary.remainingCalories,
    workoutCalories: dashboardSummary.today.workoutCalories,
    craving: "momos",
    sodiumMg: dashboardSummary.sodiumMg
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="AI coach"
        title="Daily recommendations"
        description="Personalized nudges for protein, calories, recovery, cravings, and realistic adherence."
      />

      <section className="glass-panel rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-lagoon/14 text-lagoon">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="label">Coach tone</p>
            <h2 className="mt-2 text-2xl font-semibold">Strict with the math, kind with the human.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-black/62 dark:text-white/62">
              CutMode understands imperfect dieting, hunger, workouts, cravings, restaurant sodium, and the need to preserve muscle while losing fat.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {recommendations.map((recommendation) => (
          <article key={recommendation.title} className="surface p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70 text-lagoon dark:bg-white/10">
                {recommendation.category === "protein" ? (
                  <Salad className="h-5 w-5" />
                ) : recommendation.category === "recovery" ? (
                  <HeartPulse className="h-5 w-5" />
                ) : recommendation.category === "mindset" ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <Brain className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{recommendation.title}</h2>
                  <span className="rounded-full bg-black/5 px-2 py-1 text-xs capitalize text-black/55 dark:bg-white/10 dark:text-white/55">
                    {recommendation.priority}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-black/62 dark:text-white/62">{recommendation.message}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="surface p-5">
        <p className="label">Ask CutMode</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input className="field" placeholder="Ask: What should I eat with 500 calories left?" />
          <button className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white dark:bg-paper dark:text-ink">Ask coach</button>
        </div>
      </section>
    </div>
  );
}
