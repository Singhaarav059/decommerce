// Full-bleed pinned layout. Desktop: the film fills the screen, text sits in the calm left 40%.
// Phones: the film fills the top `--film-h` (set by PinnedFilm so the tallest step always fits,
// 58svh by default) and the text sits below it on the scene's floor colour.
export const FULL_PANE = "absolute inset-x-0 top-0 h-[var(--film-h,58svh)] md:inset-0 md:h-auto";
export const FULL_TEXT = [
  "absolute inset-x-0 top-[calc(var(--film-h,58svh)+8px)] px-[var(--gutter)] [--ink-2:var(--ink)]",
  "md:top-[calc(50%+var(--header-h)/2)] md:right-auto md:w-[40%] md:max-w-[560px] md:-translate-y-1/2 md:pr-6",
].join(" ");
