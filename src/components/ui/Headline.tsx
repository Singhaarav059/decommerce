import type { CSSProperties, ElementType } from "react";
import { InlinePhotos, type HeadlineMedia } from "./InlinePhotos";

/**
 * Section headline: one grotesk, sentence case, no italic accent words.
 * `reveal` lifts the words into place as the headline scrolls into view
 * (CSS view timeline, no JS); screen readers get the plain sentence as the heading's label.
 * `media` sets small photos inside the line, after the given word.
 */
export function Headline({
  text,
  as: Tag = "h1",
  className = "",
  reveal = false,
  media,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  reveal?: boolean;
  media?: HeadlineMedia;
}) {
  const plain = text.replace(/\*/g, "");
  const words = plain.split(" ");
  if (!reveal && !media) return <Tag className={`display ${className}`}>{plain}</Tag>;
  if (!reveal)
    return (
      <Tag className={`display ${className}`} aria-label={plain}>
        <span aria-hidden>
          {words.map((w, i) => (
            <span key={i}>
              {w}
              {media && media.after === i && <InlinePhotos srcs={media.srcs} />}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </span>
      </Tag>
    );
  return (
    <Tag className={`display rv-words ${className}`} aria-label={plain}>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--i": i } as CSSProperties}>{w}</span>
            </span>
            {media && media.after === i && (
              <>
                {" "}
                <InlinePhotos srcs={media.srcs} />
              </>
            )}
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
