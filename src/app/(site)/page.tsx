import { StoryProgress } from "@/components/layout/StoryProgress";
import { HeroFilm } from "@/components/home/HeroFilm";
import { StoryChapter } from "@/components/home/StoryChapter";
import { RackChapter } from "@/components/home/RackChapter";
import { ProofChapter } from "@/components/home/ProofChapter";
import { CloseChapter } from "@/components/home/CloseChapter";
import { chapters } from "@/content/home";

export default function HomePage() {
  return (
    <main id="main">
      <StoryProgress />
      <HeroFilm />
      <StoryChapter chapter={chapters.problem} />
      <RackChapter />
      <StoryChapter chapter={chapters.order} />
      <StoryChapter chapter={chapters.pack} />
      <StoryChapter chapter={chapters.delivery} />
      <StoryChapter chapter={chapters.counter} />
      <ProofChapter />
      <CloseChapter />
    </main>
  );
}
