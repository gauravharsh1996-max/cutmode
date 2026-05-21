import { Barcode, Database, Sparkles } from "lucide-react";
import { BarcodeSearch } from "@/components/meals/barcode-search";
import { ManualMealForm } from "@/components/meals/manual-meal-form";
import { MealPhotoDropzone } from "@/components/meals/meal-photo-dropzone";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";

export default async function MealsPage() {
  const mealsToday = await prisma.meal.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Smart meal logging"
        title="Meals"
        description="Log manually, upload food photos, scan packaged items, and keep cravings inside the plan."
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <MealPhotoDropzone />
        <ManualMealForm />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="surface p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-berry" />
            <h2 className="font-semibold">AI foods it understands</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/62">
            Indian foods, restaurant meals, homemade bowls, momos,
            paneer dishes, shrimp curry, naan, roti, oats,
            Greek yogurt, sandwiches, protein shakes,
            and chicken meals.
          </p>
        </section>

        <section className="surface p-4">
          <div className="flex items-center gap-3">
            <Barcode className="h-5 w-5 text-lagoon" />
            <h2 className="font-semibold">Barcode scanner</h2>
          </div>

          <BarcodeSearch />
        </section>

        <section className="surface p-4">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-matcha" />
            <h2 className="font-semibold">Custom meals</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/62">
            Save repeat meals like &quot;home chicken bowl&quot;
or &quot;office sandwich&quot; so future logging takes seconds.
          </p>
        </section>
      </div>

      <section className="glass-panel rounded-lg p-5">
        <p className="label">Today</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {mealsToday.map((meal) => (
            <article
              key={meal.id}
              className="rounded-lg bg-white/70 p-4 dark:bg-white/[0.07]"
            >
              <p className="font-semibold">{meal.name}</p>

              <p className="mt-1 text-xs text-black/52 dark:text-white/52">
                {meal.time} - {meal.source}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span>{meal.calories} kcal</span>
                <span>{meal.protein}g protein</span>
                <span>{meal.carbs}g carbs</span>
                <span>{meal.fats}g fats</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent meals
          </h2>

          <span className="text-sm text-black/60 dark:text-white/60">
            History persistence enabled
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {mealsToday.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl border border-black/10 p-4 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {meal.name}
                  </h3>

                  <p className="text-sm text-black/60 dark:text-white/60">
  {meal.calories} kcal - {meal.protein}g protein
</p>
                </div>

                <div className="text-right text-sm">
                  <p>{meal.carbs}g carbs</p>
                  <p>{meal.fats}g fats</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}