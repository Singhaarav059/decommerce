"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { proof } from "@/content/home";

/** Demaze's own numbers, counted up once as they come into view. */
function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setV(Math.round(to * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return (
    <span ref={ref} className="tabular">
      {v}
      <span className="text-copper">{suffix}</span>
    </span>
  );
}

export function ProofBand() {
  return (
    <Section index="06" eyebrow={proof.eyebrow} headline={proof.headline} lead={proof.body}>
      <dl className="grid gap-4 sm:grid-cols-3">
        {proof.stats.map((st) => (
          <div key={st.label} className="rv flex flex-col justify-between rounded-[var(--radius-xl)] bg-paper p-6 ring-1 ring-white/5 md:p-8">
            <dt className="order-2 mt-6 text-ink-2">{st.label}</dt>
            <dd className="display order-1 text-[clamp(4rem,9vw,8rem)] leading-[0.85] tracking-[-0.05em]">
              <Count to={st.value} suffix={st.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
