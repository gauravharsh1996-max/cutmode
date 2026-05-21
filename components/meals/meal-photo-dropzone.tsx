"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { MealEstimate } from "@/types";
import { cn, formatKcal } from "@/lib/utils";

export function MealPhotoDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [estimate, setEstimate] = useState<MealEstimate | null>(null);
  const [isDragging, setDragging] = useState(false);
  const [isAnalyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  function selectFile(nextFile: File) {
    setFile(nextFile);
    setEstimate(null);
    setError(null);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function analyze() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    const body = new FormData();
    body.append("image", file);
    body.append("context", context);

    setAnalyzing(true);
    setError(null);

    try {
      const result = await apiClient<MealEstimate>("/api/meals/analyze", {
        method: "POST",
        body
      });
      setEstimate(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze this meal.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <section className="glass-panel rounded-lg p-4">
      <div
        className={cn(
          "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition",
          isDragging
            ? "border-lagoon bg-lagoon/10"
            : "border-black/15 bg-white/45 dark:border-white/15 dark:bg-white/[0.04]"
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const nextFile = event.dataTransfer.files.item(0);
          if (nextFile) selectFile(nextFile);
        }}
      >
        {preview ? (
          <div className="relative h-56 w-full overflow-hidden rounded-lg">
            <Image src={preview} alt="Meal preview" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-lagoon/14 text-lagoon">
            <UploadCloud className="h-7 w-7" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const nextFile = event.target.files?.item(0);
            if (nextFile) selectFile(nextFile);
          }}
        />

        <h2 className="mt-4 text-xl font-semibold">Upload a meal photo</h2>
        <p className="mt-2 max-w-md text-sm text-black/58 dark:text-white/58">
          Drop a plate photo here. Add context like &quot;homemade paneer, two rotis&quot; for better Indian-food estimates.
        </p>
        <div className="mt-4 grid w-full max-w-xl gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className="field"
            placeholder="Meal context, optional"
            value={context}
            onChange={(event) => setContext(event.target.value)}
          />
          <Button onClick={analyze} disabled={isAnalyzing}>
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            Analyze
          </Button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}

      {estimate ? (
        <div className="mt-4 rounded-lg bg-black/[0.035] p-4 dark:bg-white/[0.06]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="label">AI estimate</p>
              <h3 className="mt-1 text-xl font-semibold">{estimate.name}</h3>
              <p className="mt-1 text-sm text-black/55 dark:text-white/55">
                Confidence {Math.round(estimate.confidence * 100)}%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <span className="rounded-lg bg-white/70 px-3 py-2 dark:bg-white/10">{formatKcal(estimate.calories)}</span>
              <span className="rounded-lg bg-white/70 px-3 py-2 dark:bg-white/10">{Math.round(estimate.protein)}g protein</span>
              <span className="rounded-lg bg-white/70 px-3 py-2 dark:bg-white/10">{Math.round(estimate.carbs)}g carbs</span>
              <span className="rounded-lg bg-white/70 px-3 py-2 dark:bg-white/10">{Math.round(estimate.fats)}g fats</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {estimate.items.map((item) => (
              <div key={`${item.name}-${item.serving}`} className="rounded-lg bg-white/70 p-3 text-sm dark:bg-white/10">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-black/55 dark:text-white/55">
                  {item.serving} - {item.calories} kcal - {Math.round(item.protein)}g protein
                </p>
              </div>
            ))}
          </div>
          <ul className="mt-3 space-y-1 text-sm text-black/58 dark:text-white/58">
            {estimate.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
