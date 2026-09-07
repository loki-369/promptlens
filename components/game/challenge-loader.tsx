"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GameScreen } from "@/components/game/game-screen";
import { useAdminChallenges } from "@/lib/admin-store";

export function ChallengeLoader({ challengeId }: { challengeId: string }) {
  const { challenges, hydrated } = useAdminChallenges();

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-24 text-center text-text-muted">Loading challenge…</div>;
  }

  const challenge = challenges.find((c) => c.id === challengeId && c.published);

  if (!challenge) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center flex flex-col items-center gap-4">
        <p className="text-lg font-semibold">Challenge not found</p>
        <p className="text-text-muted text-sm">It may have been unpublished, or the link is incorrect.</p>
        <Link href="/play" className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to challenges
        </Link>
      </div>
    );
  }

  return <GameScreen key={challenge.id} challenge={challenge} />;
}
