import { ChapterRail } from "@/components/ui/ChapterRail";
import { WorldChapter } from "@/components/home/WorldChapter";
import { StorefrontChapter } from "@/components/home/StorefrontChapter";
import { OrderChapter } from "@/components/home/OrderChapter";
import { PackChapter } from "@/components/home/PackChapter";
import { chapters } from "@/content/home";

export default function HomePage() {
  return (
    <main id="main">
      <ChapterRail chapters={[...chapters]} />
      <WorldChapter />
      <StorefrontChapter />
      <OrderChapter />
      <PackChapter />
    </main>
  );
}
