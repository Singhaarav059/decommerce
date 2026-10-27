import Image from "next/image";
import { Headline } from "@/components/ui/Headline";
import { hero } from "@/content/home";
import { brand } from "@/content/site";

export const metadata = { robots: { index: false, follow: false } };

/** 1200×630 social card layout, screenshotted by scripts/og.mjs into src/app/opengraph-image.png. */
export default function OgCapture() {
  return (
    <main className="relative h-[630px] w-[1200px] overflow-hidden bg-studio">
      <div className="tag tag-lg absolute top-[32px] right-[48px] h-[566px] w-[453px] overflow-hidden">
        <Image src="/assets/hero/beat-a.webp" alt="" fill priority sizes="453px" quality={85} className="object-cover object-[50%_32%]" />
      </div>
      <div className="absolute top-14 left-16 w-[560px]">
        <p className="text-[2.4rem] leading-none font-semibold tracking-[-0.035em]">
          {brand.name}
          <span className="text-accent">.</span>
        </p>
        <Headline as="p" text={hero.headline} className="mt-16 text-[5.4rem]" />
        <p className="mt-8 max-w-[30ch] text-[1.4rem] leading-snug text-ink-soft">{brand.tagline}</p>
      </div>
    </main>
  );
}
