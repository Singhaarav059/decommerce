import { brand } from "@/content/site";

/** Lowercase wordmark with a copper full stop. Final logo is an open decision. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-[1.55rem] leading-none tracking-[-0.03em] ${className}`}>
      {brand.name}
      <span className="text-copper">.</span>
    </span>
  );
}
