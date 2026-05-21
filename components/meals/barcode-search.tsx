"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

type FoodResult = {
  id?: string;
  name: string;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  servingLabel?: string;
};

export function BarcodeSearch() {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function search() {
    if (!barcode.trim()) return;
    try {
      const response = await apiClient<{ items: FoodResult[] }>(`/api/foods?barcode=${encodeURIComponent(barcode)}`);
      const item = response.items[0];
      setResult(
        item
          ? `${item.name} - ${item.caloriesPerServing ?? 0} kcal, ${item.proteinPerServing ?? 0}g protein per ${item.servingLabel ?? "serving"}`
          : "No barcode match yet. Save it as a custom packaged food."
      );
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Could not search barcode.");
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2">
        <input className="field" placeholder="Enter barcode" value={barcode} onChange={(event) => setBarcode(event.target.value)} />
        <Button type="button" variant="secondary" className="px-3" onClick={search} aria-label="Search barcode">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {result ? <p className="text-sm text-black/58 dark:text-white/58">{result}</p> : null}
    </div>
  );
}
