import { brand } from "@/content/site";

/** Lowercase grotesk wordmark with a copper full stop. Final logo is an open decision. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[1.4rem] leading-none font-semibold tracking-[-0.035em] ${className}`}>
      {brand.name}
      <span className="text-copper">.</span>
    </span>
  );
}
