// The one section layout (DESIGN-PLAN §2): a text column and a visual pane
// that never overlap. Desktop: text on the left (about 5/12), the film pane on
// the right, bleeding to the page edge. Phones: the film on top, text below.
// Footage panes are 16:9 (desktop frames) and 4:3 (phone frames) with feathered
// edges so they melt into the studio colour.

/** Feathered edges on both axes (mask, so it works for <img> and <canvas>). */
const FEATHER =
  "[mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent),linear-gradient(to_bottom,transparent,#000_11%,#000_89%,transparent)] [mask-composite:intersect] [-webkit-mask-composite:source-in]";

/**
 * Film pane inside a pinned (sticky 100svh) section. Phone frames are 4:3
 * centre crops (footage shot to the safe-area rule) or the full 16:9 frame.
 */
export function filmPane(phone: "4:3" | "16:9" = "4:3") {
  return [
    `absolute inset-x-0 top-[calc(var(--header-h)+8px)] ${phone === "4:3" ? "aspect-[4/3]" : "aspect-video"}`,
    "md:inset-x-auto md:left-[38%] md:right-0 md:top-[calc(50%+var(--header-h)/2)] md:aspect-video md:-translate-y-1/2",
    FEATHER,
  ].join(" ");
}

/** Text column inside a pinned section: left of the pane, or below it on phones. */
export function textColumn(phone: "4:3" | "16:9" = "4:3") {
  return [
    `absolute inset-x-0 ${phone === "4:3" ? "top-[calc(var(--header-h)+75vw+20px)]" : "top-[calc(var(--header-h)+56.25vw+28px)]"} px-[var(--gutter)]`,
    "md:top-[calc(50%+var(--header-h)/2)] md:right-auto md:w-[38%] md:-translate-y-1/2 md:pr-10",
  ].join(" ");
}
