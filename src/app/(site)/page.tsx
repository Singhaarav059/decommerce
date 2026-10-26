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
import { TrustStrip } from "@/components/home/TrustStrip";
import { AudiencesSection } from "@/components/home/AudiencesSection";
import { IntegrationsSection } from "@/components/home/IntegrationsSection";
import { CompareSection } from "@/components/home/CompareSection";
import { HomeFaq } from "@/components/home/HomeFaq";
import { CloseChapter } from "@/components/home/CloseChapter";
import { MarqueeBand } from "@/components/ui/MarqueeBand";
import { ribbon } from "@/content/home";

/**
 * The homepage as one story, after hours in the store: the system opening onto the shop,
 * the product working (01), the problem collapsing into one stock count (02), one order
 * followed from click to doorstep (03), the rail you can browse, the modules (04), who it is
 * for (05), integrations (06), how it compares (07), how we work (08), questions (09) and the
 * demo (10). Demaze's own numbers sit in the strip under the hero.
 */
export default function HomePage() {
  return (
    <main id="main">
      <StoryProgress />
      <HeroFilm />
      <TrustStrip />
      <MarqueeBand items={ribbon} />
      <ServiceSection />
      <Collapse />
      <CostsSection />
      <Journey />
      <RackChapter />
      <KineticStatement />
      <ModulesIndex />
      <AudiencesSection />
      <IntegrationsSection />
      <CompareSection />
      <EngagementSection />
      <HomeFaq />
      <CloseChapter />
    </main>
  );
}
