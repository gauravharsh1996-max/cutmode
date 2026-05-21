"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export function CravingMode() {
  const [suggestion, setSuggestion] = useState("Log the craving and CutMode will fit it into the budget without turning it into a moral event.");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    try {
      const response = await apiClient<{ suggestion: string }>("/api/cravings", {
        method: "POST",
        body: JSON.stringify({
          label: formData.get("label"),
          intensity: Number(formData.get("intensity")),
          remainingCalories: Number(formData.get("remainingCalories"))
        })
      });
      setSuggestion(response.suggestion);
    } catch (error) {
      setSuggestion(error instanceof Error ? error.message : "Could not process craving.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-berry/14 text-berry">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Craving Mode</h2>
          <p className="text-sm text-black/55 dark:text-white/55">Plan it, swap it, or fit it. No food bans.</p>
        </div>
      </div>

      <form action={submit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_140px_160px_auto]">
        <input className="field" name="label" placeholder="momos, chocolate, chips..." required />
        <input className="field" name="intensity" type="number" min="1" max="10" defaultValue="7" />
        <input className="field" name="remainingCalories" type="number" min="0" defaultValue="500" />
        <Button disabled={loading}>{loading ? "Thinking..." : "Fit it"}</Button>
      </form>

      <div className="mt-4 rounded-lg bg-black/[0.035] p-4 text-sm leading-6 text-black/72 dark:bg-white/[0.06] dark:text-white/72">
        {suggestion}
      </div>
    </section>
  );
}
