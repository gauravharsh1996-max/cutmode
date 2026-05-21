import { Clock, Dumbbell, Flame, NotebookTabs, UserRoundCog } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { workouts } from "@/lib/data/mock";

export default function WorkoutsPage() {
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Training"
        title="Workouts"
        description="Track lifting, cardio, incline treadmill sessions, templates, and trainer notes."
        actions={
          <>
            <Button variant="secondary">
              <NotebookTabs className="h-4 w-4" />
              Templates
            </Button>
            <Button>
              <Dumbbell className="h-4 w-4" />
              Log workout
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Workout calories" value={`${totalCalories} kcal`} detail="This week" icon={Flame} tone="coral" />
        <MetricCard label="Training time" value={`${totalMinutes} min`} detail="Gym plus cardio" icon={Clock} tone="lagoon" />
        <MetricCard label="Trainer mode" value="Enabled" detail="Templates and coaching notes ready" icon={UserRoundCog} tone="berry" />
      </div>

      <section className="glass-panel rounded-lg p-5">
        <p className="label">Recent sessions</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {workouts.map((workout) => (
            <article key={workout.id} className="rounded-lg bg-white/72 p-4 dark:bg-white/[0.07]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{workout.title}</h2>
                  <p className="mt-1 text-xs text-black/52 dark:text-white/52">
                    {workout.kind} - {workout.performedAt}
                  </p>
                </div>
                <span className="rounded-full bg-lagoon/12 px-3 py-1 text-xs font-semibold text-lagoon">{workout.calories} kcal</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-black/62 dark:text-white/62">
                <span>{workout.duration} min</span>
                {"incline" in workout && workout.incline ? <span>{workout.incline}% incline</span> : <span>Strength focus</span>}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-black/65 dark:text-white/65">
                {workout.exercises.map((exercise) => (
                  <li key={exercise}>{exercise}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="surface p-5">
        <p className="label">Custom exercise builder</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input className="field" placeholder="Exercise name" />
          <input className="field" placeholder="Sets" type="number" />
          <input className="field" placeholder="Reps or duration" />
          <input className="field" placeholder="Load, incline, notes" />
        </div>
      </section>
    </div>
  );
}
