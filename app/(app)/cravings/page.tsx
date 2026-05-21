import { Cookie, HeartHandshake, IceCreamBowl, Sparkles } from "lucide-react";
import { CravingMode } from "@/components/cravings/craving-mode";
import { PageHeader } from "@/components/ui/page-header";

const examples = [
  {
    icon: Cookie,
    title: "Chocolate",
    copy: "Keep a controlled serving after a protein-heavy meal."
  },
  {
    icon: IceCreamBowl,
    title: "Momos",
    copy: "Choose steamed, reduce sauce, and pair with lean protein."
  },
  {
    icon: Sparkles,
    title: "Diet Coke",
    copy: "Fine inside the plan. Keep water intake steady."
  }
];

export default function CravingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Moderation"
        title="Cravings"
        description="CutMode treats cravings as planning data, not failure."
      />

      <CravingMode />

      <div className="grid gap-4 md:grid-cols-3">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <section key={example.title} className="surface p-4">
              <Icon className="h-5 w-5 text-berry" />
              <h2 className="mt-3 font-semibold">{example.title}</h2>
              <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/58">{example.copy}</p>
            </section>
          );
        })}
      </div>

      <section className="rounded-lg border border-matcha/20 bg-matcha/12 p-4">
        <div className="flex items-start gap-3">
          <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-matcha" />
          <p className="text-sm leading-6 text-black/72 dark:text-white/72">
            The best diet is the one you can repeat. CutMode will suggest swaps when useful, but it can also help you fit the real craving into the day.
          </p>
        </div>
      </section>
    </div>
  );
}
