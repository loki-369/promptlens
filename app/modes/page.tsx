import Link from "next/link";
import { Camera, Calendar, Users, ArrowRight, Aperture } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const MODES = [
  {
    icon: Camera,
    title: "Guess the Prompt",
    href: "/play",
    desc: "Inspect AI images, deduce the ground-truth visual concepts, and score on Subject, Scene & Camera Details.",
    tag: "Solo Practice",
  },
  {
    icon: Calendar,
    title: "Daily Benchmark",
    href: "/daily",
    desc: "Everyone in the world gets the same image today. One attempt, one score, one shared global leaderboard.",
    tag: "Daily Event",
  },
  {
    icon: Users,
    title: "Group Events & Competitions",
    href: "/events",
    desc: "Host private group rooms for closed events, workshops, or team battles with live sync & CSV export.",
    tag: "Multiplayer",
  },
];

export default function ModesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-accent mb-3">
          <Aperture className="h-3.5 w-3.5" /> Optical Modes & Formats
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight mb-3">
          Three Ways to Train Your Eye
        </h1>
        <p className="text-text-muted text-sm max-w-xl mx-auto leading-relaxed">
          Select a format below to begin reverse-engineering AI images into precise textual concepts.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {MODES.map((m) => (
          <Link key={m.href} href={m.href}>
            <GlassCard className="p-6 flex items-start gap-5 hover:border-accent transition-all group shadow-md hover:-translate-y-0.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-2 border border-border-strong text-accent shadow-sm group-hover:scale-105 transition-transform">
                <m.icon className="h-6 w-6 stroke-[2]" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <h2 className="font-display font-bold text-lg group-hover:text-accent transition-colors">{m.title}</h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/40 bg-accent-soft/40 rounded-full px-2.5 py-0.5">
                    {m.tag}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{m.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-faint group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-2" />
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
