import { StoryProgress } from "@/components/layout/StoryProgress";
import { HeroFilm } from "@/components/home/HeroFilm";
import { ServiceSection } from "@/components/home/ServiceSection";
import { Collapse } from "@/components/home/Collapse";
import { CostsSection } from "@/components/home/CostsSection";
import { Journey } from "@/components/home/Journey";
import { RackChapter } from "@/components/home/RackChapter";
import { KineticStatement } from "@/components/home/KineticStatement";
import { ModulesIndex } from "@/components/home/ModulesIndex";
import { EngagementSection } from "@/components/home/EngagementSection";
import { ProofBand } from "@/components/home/ProofBand";
import { HomeFaq } from "@/components/home/HomeFaq";
import { CloseChapter } from "@/components/home/CloseChapter";
import { MarqueeBand } from "@/components/ui/MarqueeBand";
import { ribbon } from "@/content/home";

/**
 * The homepage as one story, after hours in the store: the system opening onto the shop,
 * the product working (01), the problem collapsing into one stock count (02), one order
 * followed from click to doorstep (03), the rail you can browse, the modules (04), how we
 * work (05), who builds it (06), questions (07) and the demo (08).
 */
export default function HomePage() {
  return (
    <main id="main">
      <StoryProgress />
      <HeroFilm />
      <MarqueeBand items={ribbon} />
      <ServiceSection />
      <Collapse />
      <CostsSection />
      <Journey />
      <RackChapter />
      <KineticStatement />
      <ModulesIndex />
      <EngagementSection />
      <ProofBand />
      <HomeFaq />
      <CloseChapter />
    </main>
  );
}
