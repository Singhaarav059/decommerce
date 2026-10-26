import type { CSSProperties } from "react";
import { statement } from "@/content/home";

/**
 * One large sentence whose words come into focus one after another as it scrolls through the
 * screen (CSS scroll timeline, no JS). Key words take the copper accent. Without scroll
 * timelines, or with reduced motion, the sentence is simply shown in full.
 */
const KEY = new Set(["one", "shop.", "you."]);

export function KineticStatement() {
  const words = statement.split(" ");
  const n = words.length;
  return (
    <section aria-label="Our promise" className="kinetic relative bg-studio">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[clamp(96px,14vw,200px)]">
        <p className="display text-[clamp(2.2rem,5.6vw,5.6rem)] leading-[1.02] tracking-[-0.04em]">
          <span>
            {words.map((w, i) => (
              <span key={i} className={`kin-word ${KEY.has(w.toLowerCase()) ? "text-accent" : ""}`} style={{ "--s": `${8 + (i / n) * 52}%`, "--e": `${14 + (i / n) * 52}%` } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
