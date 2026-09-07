import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ScoringShowcase } from "@/components/home/scoring-showcase";
import { ModesGrid } from "@/components/home/modes-grid";
import { CategoriesSection } from "@/components/home/categories-section";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <HowItWorks />
      <ScoringShowcase />
      <ModesGrid />
      <CategoriesSection />
      <FinalCta />
    </div>
  );
}
