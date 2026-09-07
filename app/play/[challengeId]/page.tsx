import { getChallengeById, CHALLENGES } from "@/data/challenges";
import { GameScreen } from "@/components/game/game-screen";
import { ChallengeLoader } from "@/components/game/challenge-loader";

export function generateStaticParams() {
  return CHALLENGES.map((c) => ({ challengeId: c.id }));
}

export default async function ChallengePage({
  params,
}: PageProps<"/play/[challengeId]">) {
  const { challengeId } = await params;
  const challenge = getChallengeById(challengeId);

  if (challenge && challenge.published) {
    return <GameScreen key={challenge.id} challenge={challenge} />;
  }

  // Not one of the built-in seed challenges — check admin-created ones
  // (stored client-side) before giving up.
  return <ChallengeLoader challengeId={challengeId} />;
}
