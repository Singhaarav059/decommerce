import Image from "next/image";
import { Headline } from "@/components/ui/Headline";
import { hero } from "@/content/home";
import { posters } from "@/content/media";
import { brand } from "@/content/site";

export const metadata = { robots: { index: false, follow: false } };

/** 1200×630 social card layout, screenshotted by scripts/og.mjs into src/app/opengraph-image.png. */
export default function OgCapture() {
  return (
    <main className="relative h-[630px] w-[1200px] overflow-hidden bg-stone-50">
      <Image src={posters.world.desktop} alt="" width={1440} height={900} priority className="absolute top-[-40px] right-[-210px] h-[740px] w-auto max-w-none" />
      <div className="absolute top-14 left-16 w-[560px]">
        <p className="font-serif text-[2.6rem] leading-none tracking-[-0.03em]">
          {brand.name}
          <span className="text-copper">.</span>
        </p>
        <Headline as="p" text={hero.headline} className="mt-16 text-[6.2rem]" />
        <p className="mt-8 max-w-[30ch] text-[1.4rem] leading-snug text-ink-soft">{brand.tagline}</p>
      </div>
    </main>
  );
}
