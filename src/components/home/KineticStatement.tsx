import type { CSSProperties } from "react";
import { statement } from "@/content/home";

/**
 * One large sentence whose words come into focus one after another as it scrolls through the
 * screen (CSS scroll timeline, no JS). Key words take the copper accent. Without scroll
 * timelines, or with reduced motion, the sentence is simply shown in full.
 */
const KEY = new Set(["one", "catalog,", "stock", "count", "customer", "record,", "run"]);

export function KineticStatement() {
  const words = statement.split(" ");
  const n = words.length;
  return (
    <section aria-label="Our promise" className="kinetic relative bg-studio">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--gutter)] py-[clamp(96px,14vw,200px)]">
        <p className="display max-w-[22ch] text-[clamp(2.2rem,5.2vw,5.2rem)] leading-[1.02]">
          <span className="sr-only">{statement}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <span key={i} className={`kin-word ${KEY.has(w.toLowerCase()) ? "text-copper" : ""}`} style={{ "--s": `${8 + (i / n) * 52}%`, "--e": `${14 + (i / n) * 52}%` } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
