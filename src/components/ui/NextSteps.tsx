import { contactNext } from "@/content/company";

/**
 * Beside a demo form: what happens after you send it, as a short track that draws itself down the
 * page as it scrolls in (CSS scroll timeline), each step arriving after the one before.
 */
export function NextSteps({ className = "" }: { className?: string }) {
  const steps = contactNext.steps.slice(1);
  return (
    <div className={className}>
      <p className="text-[0.875rem] font-semibold">{contactNext.eyebrow}</p>
      <ol className="next-steps relative mt-5">
        <span aria-hidden className="next-steps-line absolute top-3 bottom-3 left-[11px] w-[2px] bg-accent" />
        {steps.map((s, i) => (
          <li key={s.title} className="rv-step relative pb-6 pl-10 last:pb-0" style={{ "--i": i } as React.CSSProperties}>
            <span aria-hidden className="absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full bg-accent text-[0.75rem] font-semibold text-paper">
              {i + 1}
            </span>
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 max-w-[40ch] text-[0.95rem] leading-relaxed text-ink-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
