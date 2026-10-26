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
    <div className={`rounded-[var(--radius-xl)] bg-paper p-6 ring-1 ring-black/5 md:p-7 ${className}`}>
      <p className="text-[1.05rem] font-semibold">{askAi.title}</p>
      <p className="mt-1 max-w-[52ch] text-[0.95rem] text-ink-2">{askAi.body}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.name}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.9rem] font-semibold shadow-[inset_0_0_0_1px_var(--line-strong)] transition-colors hover:bg-ink hover:text-paper">
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
