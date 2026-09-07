import Link from "next/link";
import { Target, CalendarDays, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const MODES = [
  {
    icon: Target,
    title: "Guess the Prompt",
    href: "/play",
    desc: "See an AI-generated image, write the prompt you think made it, and get scored on 3 easy-to-read categories — Subject, Scene & Style, and Details.",
    tag: "Main mode",
  },
  {
    icon: CalendarDays,
    title: "Daily Challenge",
    href: "/daily",
    desc: "Everyone in the world gets the same image today. One attempt, one score, one shared leaderboard.",
    tag: "Compete daily",
  },
];

export default function ModesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Game modes</p>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-3">Two ways to train your eye</h1>
        <p className="text-text-muted max-w-xl mx-auto">
          Keep it simple: play a challenge whenever you want, or take on today&apos;s Daily Challenge with everyone else.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MODES.map((m) => (
          <Link key={m.href} href={m.href}>
            <GlassCard className="p-6 flex items-start gap-5 hover:border-accent transition-colors group">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent-soft border border-border">
                <m.icon className="h-5 w-5 text-accent" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="font-display font-semibold text-lg">{m.title}</h2>
                  <span className="text-[10px] uppercase tracking-wide text-text-faint border border-border-strong rounded-md px-2 py-0.5">
                    {m.tag}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">{m.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-faint group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1.5" />
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
