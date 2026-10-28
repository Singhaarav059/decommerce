import { HomeHero } from "@/components/home/HomeHero";
import { CommerceIntro } from "@/components/home/CommerceIntro";
import { HomeExperience } from "@/components/home/HomeExperience";
import { StockStory } from "@/components/home/StockStory";

export default function HomePage() {
  return <main id="main"><HomeHero /><CommerceIntro /><StockStory /><HomeExperience /></main>;
}
