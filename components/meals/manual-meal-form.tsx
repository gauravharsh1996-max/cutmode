"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export function ManualMealForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setStatus("Saving meal...");
    const payload = Object.fromEntries(formData.entries());

    try {
      await apiClient("/api/meals", {
        method: "POST",
        body: JSON.stringify({
          name: payload.name,
          calories: Number(payload.calories),
          protein: Number(payload.protein),
          carbs: Number(payload.carbs),
          fats: Number(payload.fats),
          source: "MANUAL"
        })
      });
      setStatus("Meal saved");
      location.reload();
    } catch (error) {
        console.error(error);
        setStatus(error instanceof Error ? error.message : "Could not save meal");

  }
  }

  return (
    <form
      action={submit}
      className="surface p-4"
     >
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-matcha/14 text-matcha">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">Manual meal</h2>
          <p className="text-sm text-black/55 dark:text-white/55">Quick add calories and macros.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 sm:col-span-2">
          <span className="label">Meal name</span>
          <input className="field" name="name" required placeholder="Chicken meal, paneer wrap, oats..." />
        </label>
        <label className="space-y-1">
          <span className="label">Calories</span>
          <input className="field" name="calories" type="number" min="0" required placeholder="520" />
        </label>
        <label className="space-y-1">
          <span className="label">Protein</span>
          <input className="field" name="protein" type="number" min="0" step="0.1" required placeholder="38" />
        </label>
        <label className="space-y-1">
          <span className="label">Carbs</span>
          <input className="field" name="carbs" type="number" min="0" step="0.1" required placeholder="48" />
        </label>
        <label className="space-y-1">
          <span className="label">Fats</span>
          <input className="field" name="fats" type="number" min="0" step="0.1" required placeholder="14" />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-black/55 dark:text-white/55">{status}</p>
        <Button type="submit">
         <Save className="h-4 w-4" />
         Save meal
      </Button>
      </div>
    </form>
  );
}
