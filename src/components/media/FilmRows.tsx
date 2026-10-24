"use client";

import { useState } from "react";
import { RowList } from "@/components/home/StepText";
import { useSequenceProgress } from "./ScrollSequence";

/** Numbered steps that tick off as the film plays between `from` and `to`. */
export function FilmRows({ rows, from, to }: { rows: string[]; from: number; to: number }) {
  const [active, setActive] = useState(0);
  useSequenceProgress((p) => {
    const i = Math.min(rows.length - 1, Math.max(0, Math.floor(((p - from) / (to - from)) * rows.length)));
    setActive((a) => (a === i ? a : i));
  });
  return <RowList active={active} rows={rows.map((r, i) => ({ key: r, left: `${i + 1}. ${r}`, right: i < active ? "Done" : i === active ? "Now" : "" }))} />;
}
