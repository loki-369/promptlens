import { getDailyChallenge } from "@/data/challenges";
import { GameScreen } from "@/components/game/game-screen";
import { DailyBanner } from "@/components/daily/daily-banner";

export default function DailyPage() {
  const challenge = getDailyChallenge();
  return (
    <div>
      <DailyBanner />
      <GameScreen key={`daily-${challenge.id}`} challenge={challenge} />
    </div>
  );
}
