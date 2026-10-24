import { StoryProgress } from "@/components/layout/StoryProgress";
import { HeroFilm } from "@/components/home/HeroFilm";
import { WorldChapter } from "@/components/home/WorldChapter";
import { StorefrontChapter } from "@/components/home/StorefrontChapter";
import { OrderChapter } from "@/components/home/OrderChapter";
import { PackChapter } from "@/components/home/PackChapter";
import { DeliveryChapter } from "@/components/home/DeliveryChapter";
import { InStoreChapter } from "@/components/home/InStoreChapter";
import { ProofChapter } from "@/components/home/ProofChapter";
import { CloseChapter } from "@/components/home/CloseChapter";
import { Opening } from "@/components/home/Opening";

export default function HomePage() {
  return (
    <main id="main">
      <Opening />
      <StoryProgress />
      <HeroFilm />
      <WorldChapter />
      <StorefrontChapter />
      <OrderChapter />
      <PackChapter />
      <DeliveryChapter />
      <InStoreChapter />
      <ProofChapter />
      <CloseChapter />
    </main>
  );
}
