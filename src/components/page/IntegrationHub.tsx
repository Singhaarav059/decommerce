"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { integrations } from "@/content/integrations";

export function IntegrationHub() {
  const [active, setActive] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!motionAllowed || !running) return;
    const timer = window.setInterval(() => { if (!document.hidden) setActive(index => (index + 1) % integrations.categories.length); }, 2400);
    return () => window.clearInterval(timer);
  }, [motionAllowed, running]);
  const item = integrations.categories[active];
  return <div className="integration-stage"><Image src="/assets/editorial/integrations-studio-v1.png" alt="" fill sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" /><div className="integration-stage-shade" /><div className="integration-stage-content"><div className="integration-stage-top"><span>ONE CONNECTED WORLD</span><span>EXAMPLE / LIVE SYNC</span></div><div className="integration-orbit" aria-hidden="true"><div className="integration-orbit-ring ring-one" /><div className="integration-orbit-ring ring-two" /><div className="integration-orbit-center"><span>decommerce<b>.</b></span></div><span className="integration-orbit-dot" style={{ animationPlayState: running && motionAllowed ? "running" : "paused" }} /></div><div className="integration-status"><span className="integration-status-dot" /><div><strong>{item.name}</strong><p>{item.event}</p></div><span>CONNECTED ↗</span></div>{motionAllowed && <button className="integration-motion-toggle" type="button" onClick={() => setRunning(value => !value)}>{running ? "Pause animation ❚❚" : "Play animation ▶"}</button>}</div></div>;
}
