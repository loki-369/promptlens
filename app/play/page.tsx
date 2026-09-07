import { Suspense } from "react";
import { ChallengePicker } from "@/components/play/challenge-picker";

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-20 text-text-muted">Loading challenges…</div>}>
      <ChallengePicker />
    </Suspense>
  );
}
