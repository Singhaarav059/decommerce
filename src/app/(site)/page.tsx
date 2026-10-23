import { ChapterRail } from "@/components/ui/ChapterRail";
import { WorldChapter } from "@/components/home/WorldChapter";
import { chapters } from "@/content/home";

export default function HomePage() {
  return (
    <main id="main">
      <ChapterRail chapters={[...chapters]} />
      <WorldChapter />
    </main>
  );
}
