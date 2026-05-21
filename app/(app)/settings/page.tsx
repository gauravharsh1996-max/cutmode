import { Bell, Cloud, HeartPulse, KeyRound, Link2, Moon, Smartphone } from "lucide-react";
import { GoalSettingsForm } from "@/components/settings/goal-settings-form";
import { PageHeader } from "@/components/ui/page-header";

const reminders = [
  ["Protein", "11:30 AM"],
  ["Hydration", "Every 2 hours"],
  ["Meal", "8:30 PM"],
  ["Workout", "6:00 PM"],
  ["Sleep", "10:45 PM"]
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Targets, reminders, integrations, storage, and secure AI configuration."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <GoalSettingsForm />

        <section className="surface p-5">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-saffron" />
            <h2 className="text-xl font-semibold">Smart reminders</h2>
          </div>
          <div className="mt-4 space-y-3">
            {reminders.map(([label, time]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg bg-white/70 p-3 dark:bg-white/[0.07]">
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-black/55 dark:text-white/55">{time}</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-lagoon" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <section className="surface p-4">
          <KeyRound className="h-5 w-5 text-lagoon" />
          <h2 className="mt-3 font-semibold">Authentication</h2>
          <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/58">Clerk protects app pages and API routes.</p>
        </section>
        <section className="surface p-4">
          <Cloud className="h-5 w-5 text-matcha" />
          <h2 className="mt-3 font-semibold">Image storage</h2>
          <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/58">Cloudinary stores meal and progress photos.</p>
        </section>
        <section className="surface p-4">
          <HeartPulse className="h-5 w-5 text-coral" />
          <h2 className="mt-3 font-semibold">Health sync</h2>
          <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/58">Apple Health and Google Fit integration hooks are ready.</p>
        </section>
        <section className="surface p-4">
          <Moon className="h-5 w-5 text-berry" />
          <h2 className="mt-3 font-semibold">Dark mode</h2>
          <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/58">Theme preference is saved locally.</p>
        </section>
      </div>

      <section className="surface p-5">
        <div className="flex items-center gap-3">
          <Smartphone className="h-5 w-5 text-lagoon" />
          <h2 className="font-semibold">Connected devices</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Apple Health", "Google Fit"].map((name) => (
            <div key={name} className="flex items-center justify-between gap-3 rounded-lg bg-white/70 p-4 dark:bg-white/[0.07]">
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-black/55 dark:text-white/55">Steps, sleep, weight, workouts</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold dark:border-white/10">
                <Link2 className="h-4 w-4" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
