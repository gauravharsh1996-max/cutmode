"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface max-w-md p-6 text-center">
        <p className="text-sm font-semibold text-coral">Something needs attention</p>
        <h2 className="mt-2 text-2xl font-semibold">CutMode could not load this view.</h2>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Try again. If it keeps happening, check the API keys and database connection.
        </p>
        <Button className="mt-5" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}
