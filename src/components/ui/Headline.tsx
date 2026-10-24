import type { CSSProperties, ElementType } from "react";

/**
 * Section headline: one grotesk, sentence case, no italic accent words.
 * `reveal` lifts the words into place as the headline scrolls into view
 * (CSS view timeline, no JS); screen readers get the plain sentence.
 */
export function Headline({
  text,
  as: Tag = "h1",
  className = "",
  reveal = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  reveal?: boolean;
}) {
  const plain = text.replace(/\*/g, "");
  if (!reveal) return <Tag className={`display ${className}`}>{plain}</Tag>;
  const words = plain.split(" ");
  return (
    <Tag className={`display rv-words ${className}`}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--i": i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
