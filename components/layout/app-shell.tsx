"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Apple,
  BarChart3,
  Bot,
  Camera,
  Dumbbell,
  Gauge,
  HeartPulse,
  Plus,
  Settings,
  Sparkles,
  Scale
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meals", label: "Meals", icon: Apple },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/weight", label: "Weight", icon: Scale },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/cravings", label: "Cravings", icon: Sparkles },
  { href: "/coach", label: "Coach", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-black/5 bg-paper/82 px-4 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d0f12]/86 lg:block">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white dark:bg-paper dark:text-ink">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">CutMode</p>
            <p className="text-xs text-black/55 dark:text-white/55">AI fat-loss assistant</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-ink text-white shadow-soft dark:bg-paper dark:text-ink"
                    : "text-black/62 hover:bg-black/5 hover:text-ink dark:text-white/62 dark:hover:bg-white/10 dark:hover:text-paper"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-lagoon/20 bg-lagoon/10 p-4 text-sm text-black/70 dark:text-white/70">
          <div className="mb-2 flex items-center gap-2 font-semibold text-lagoon">
            <Activity className="h-4 w-4" />
            10-day target
          </div>
          Stay near a 500 kcal daily deficit and protect protein first.
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-black/5 bg-paper/78 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d0f12]/82 lg:ml-72">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white dark:bg-paper dark:text-ink">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-semibold">CutMode</span>
          </Link>

          <div className="hidden min-w-0 lg:block">
            <p className="text-sm font-medium text-black/55 dark:text-white/55">Sustainable deficit, strong training, no shame.</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="secondary">Sign in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/sign-in" />
            </SignedIn>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
                  active
                    ? "bg-ink text-white dark:bg-paper dark:text-ink"
                    : "bg-white/70 text-black/65 dark:bg-white/10 dark:text-white/65"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-4 py-5 sm:px-6 lg:ml-72 lg:px-8">{children}</main>

      <Link
        href="/meals"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-glow transition hover:scale-105 dark:bg-paper dark:text-ink"
        aria-label="Quick meal upload"
      >
        <Camera className="h-5 w-5" />
        <Plus className="-ml-1 h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
