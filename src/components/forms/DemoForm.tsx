"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { brand } from "@/content/site";
import { demoForm as f } from "@/content/demo";

type State = "idle" | "sending" | "done" | "error";

const field =
  "mt-2 block w-full rounded-[var(--radius-md)] border border-line-strong bg-studio-light/60 px-4 py-3 text-[1rem] text-ink transition-[border-color,box-shadow,background-color] duration-200 " +
  "placeholder:text-ink-2/70 hover:border-ink/40 focus:border-copper focus:bg-paper focus:shadow-[0_0_0_4px_rgb(116_50_15/0.12)] focus:outline-none";

export function DemoForm({ className = "" }: { className?: string }) {
  const [state, setState] = useState<State>("idle");
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/demo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className={`rounded-[var(--radius-xl)] bg-ink p-8 text-paper md:p-10 ${className}`}>
        <p className="display text-4xl">{f.success.title}</p>
        <p className="mt-3 text-stone-50/70">{f.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`relative grid gap-4 sm:grid-cols-2 ${className}`}>
      {(["name", "email", "company"] as const).map((k) => (
        <label key={k} htmlFor={`${id}-${k}`} className={`text-sm font-medium ${k === "company" ? "sm:col-span-2" : ""}`}>
          {f.fields[k].label}
          <input id={`${id}-${k}`} name={k} type={k === "email" ? "email" : "text"} required autoComplete={f.fields[k].autoComplete} className={field} />
        </label>
      ))}
      <label htmlFor={`${id}-sells`} className="text-sm font-medium sm:col-span-2">
        {f.fields.sells.label}
        <select id={`${id}-sells`} name="sells" className={field} defaultValue={f.fields.sells.options[2]}>
          {f.fields.sells.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label htmlFor={`${id}-message`} className="text-sm font-medium sm:col-span-2">
        {f.fields.message.label}
        <textarea id={`${id}-message`} name="message" rows={4} placeholder={f.fields.message.placeholder} className={field} />
      </label>
      {/* honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" arrow disabled={state === "sending"}>
          {state === "sending" ? f.sending : f.submit}
        </Button>
        <p className="text-sm text-ink-muted">{f.privacy}</p>
      </div>
      {state === "error" && (
        <p role="alert" className="text-sm text-[var(--alert)] sm:col-span-2">
          {f.error}{" "}
          <a className="underline" href={`mailto:${brand.demoEmail}`}>
            {brand.demoEmail}
          </a>
        </p>
      )}
    </form>
  );
}
