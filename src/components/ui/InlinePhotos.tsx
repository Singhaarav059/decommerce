import Image from "next/image";

export type HeadlineMedia = { after: number; srcs: string[] };

/**
 * Small rounded photos set inside a headline, between two words (decorative; the headline's text
 * is complete without them). One photo is a wide pill; several overlap like a stack of cards.
 */
export function InlinePhotos({ srcs, delay = 0 }: { srcs: string[]; delay?: number }) {
  const one = srcs.length === 1;
  return (
    <span aria-hidden className="inline-photos mx-[0.12em] inline-flex translate-y-[-0.06em] items-center align-middle" style={{ animationDelay: `${delay}ms` }}>
      {srcs.map((src, i) => (
        <span
          key={src}
          className={`relative inline-block h-[0.78em] overflow-hidden rounded-full bg-studio-light ring-[0.05em] ring-studio ${one ? "w-[1.9em]" : "w-[0.78em]"} ${i > 0 ? "-ml-[0.22em]" : ""}`}
          style={{ zIndex: srcs.length - i }}
        >
          <Image src={src} alt="" fill sizes="160px" quality={70} className="object-cover object-[70%_50%]" />
        </span>
      ))}
    </span>
  );
}
