import Image from "next/image";

export type HeadlineMedia = { after: number; srcs: string[] };

/**
 * Small photos cut to the hang-tag shape, set inside a headline between two words (decorative; the
 * headline's text is complete without them). They sit in the line like words, side by side.
 */
export function InlinePhotos({ srcs, delay = 0 }: { srcs: string[]; delay?: number }) {
  const one = srcs.length === 1;
  return (
    <span aria-hidden className="inline-photos mx-[0.12em] inline-flex translate-y-[-0.04em] items-center gap-[0.08em] align-middle" style={{ animationDelay: `${delay}ms` }}>
      {srcs.map((src) => (
        <span
          key={src}
          className={`tag relative inline-block h-[0.8em] overflow-hidden bg-studio-light [--cut:0.26em] ${one ? "w-[1.9em]" : "w-[1.15em]"}`}
        >
          <Image src={src} alt="" fill sizes="160px" quality={70} className="object-cover object-[70%_50%]" />
        </span>
      ))}
    </span>
  );
}
