import type { ElementType } from "react";

/** Section headline: one grotesk, sentence case, no italic accent words. */
export function Headline({
  text,
  as: Tag = "h1",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  return <Tag className={`display ${className}`}>{text.replace(/\*/g, "")}</Tag>;
}
