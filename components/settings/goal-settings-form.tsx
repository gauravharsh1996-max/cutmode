"use client";

import { useState } from "react";
import { Save, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export function GoalSettingsForm() {
  const [status, setStatus] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setStatus("Saving targets...");
    try {
      await apiClient("/api/goals", {
        method: "PUT",
        body: JSON.stringify({
          calorieTarget: Number(formData.get("calorieTarget")),
          proteinTarget: Number(formData.get("proteinTarget")),
          tenDayDeficitGoal: Number(formData.get("tenDayDeficitGoal")),
          targetWeightKg: Number(formData.get("targetWeightKg"))
        })
      });
      setStatus("Targets saved");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save targets");
    }
  }

  return (
    <form action={submit} className="glass-panel rounded-lg p-5">
      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-lagoon" />
        <h2 className="text-xl font-semibold">Daily targets</h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="label">Calorie target</span>
          <input className="field" name="calorieTarget" defaultValue="2050" type="number" min="1200" />
        </label>
        <label className="space-y-1">
          <span className="label">Protein target</span>
          <input className="field" name="proteinTarget" defaultValue="130" type="number" min="40" />
        </label>
        <label className="space-y-1">
          <span className="label">10-day deficit goal</span>
          <input className="field" name="tenDayDeficitGoal" defaultValue="5000" type="number" min="1000" />
        </label>
        <label className="space-y-1">
          <span className="label">Target weight kg</span>
          <input className="field" name="targetWeightKg" defaultValue="78" type="number" min="30" step="0.1" />
        </label>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-black/55 dark:text-white/55">{status}</p>
        <Button>
          <Save className="h-4 w-4" />
          Save targets
        </Button>
      </div>
    </form>
  );
}
