import type { ElementType } from "react";

/** Renders "plain words *accent* words" with the accent in serif italic. */
export function Headline({
  text,
  as: Tag = "h1",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Tag className={`display ${className}`}>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part,
      )}
    </Tag>
  );
}
