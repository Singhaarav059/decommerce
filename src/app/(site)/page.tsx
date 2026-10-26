import { StoryProgress } from "@/components/layout/StoryProgress";
import { HeroFilm } from "@/components/home/HeroFilm";
import { ServiceSection } from "@/components/home/ServiceSection";
import { StoryChapter } from "@/components/home/StoryChapter";
import { CostsSection } from "@/components/home/CostsSection";
import { RackChapter } from "@/components/home/RackChapter";
import { ModulesIndex } from "@/components/home/ModulesIndex";
import { ProofChapter } from "@/components/home/ProofChapter";
import { EngagementSection } from "@/components/home/EngagementSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { CloseChapter } from "@/components/home/CloseChapter";
import { JourneyRail } from "@/components/home/JourneyRail";
import { MarqueeBand } from "@/components/ui/MarqueeBand";
import { chapters, ribbon } from "@/content/home";

/**
 * The homepage story: what Decommerce is, the problem it solves, then one order (ORD-1042)
 * followed from the website to the customer's door and the shop counter, the modules behind it,
 * who builds it and how an engagement runs.
 */
export default function HomePage() {
  return (
    <main id="main">
      <StoryProgress />
      <JourneyRail />
      <HeroFilm />
      <MarqueeBand items={ribbon} />
      <ServiceSection />
      <StoryChapter chapter={chapters.problem} />
      <CostsSection />
      <RackChapter />
      <StoryChapter chapter={chapters.order} />
      <StoryChapter chapter={chapters.pack} />
      <StoryChapter chapter={chapters.delivery} />
      <StoryChapter chapter={chapters.counter} />
      <ModulesIndex />
      <ProofChapter />
      <EngagementSection />
      <HomeFaq />
      <CloseChapter />
    </main>
  );
}
