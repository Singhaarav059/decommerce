import { askAi } from "@/content/home";

/** Buttons that open an AI assistant with a prefilled question about Decommerce (new tab). */
export function AskAi({ prompt = askAi.prompt, className = "" }: { prompt?: string; className?: string }) {
  const q = encodeURIComponent(prompt);
  const links = [
    { name: "Ask ChatGPT", href: `https://chatgpt.com/?q=${q}` },
    { name: "Ask Claude", href: `https://claude.ai/new?q=${q}` },
    { name: "Ask Perplexity", href: `https://www.perplexity.ai/search?q=${q}` },
  ];
  return (
    <div className={className}>
      <p className="text-[1.05rem] font-semibold">{askAi.title}</p>
      <p className="mt-1 max-w-[42ch] text-ink-2">{askAi.body}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="tag tag-xs tag-plain inline-flex h-10 items-center gap-2 bg-ink/[0.06] pr-4 pl-5 text-[0.94rem] font-semibold transition-colors hover:bg-ink hover:text-paper">
              {l.name}
              <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
