"use client";

import { useEffect, useState, type ReactNode } from "react";

// true once the first page has mounted: only later, in-site navigations fade in,
// so the first load paints at once.
let mounted = false;

/** Re-mounts on every route change, so each page fades in instead of cutting hard. */
export default function Template({ children }: { children: ReactNode }) {
  const [fade] = useState(() => mounted);
  useEffect(() => {
    mounted = true;
  }, []);
  return <div className={fade ? "page-in" : undefined}>{children}</div>;
}
