import { NextResponse } from "next/server";

/**
 * Book-a-demo submissions. Validates, drops honeypot spam, then forwards the
 * lead as JSON to DEMO_WEBHOOK_URL (a CRM, Slack or form-to-email endpoint;
 * the destination is still an open decision). Without the variable the lead
 * is only logged, which is fine for previews.
 */
type Lead = { name: string; email: string; company: string; sells: string; message: string; website?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Partial<Lead>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  // honeypot: real people never fill the hidden "website" field
  if (body.website) return NextResponse.json({ ok: true });

  const lead = {
    name: String(body.name ?? "").trim().slice(0, 120),
    email: String(body.email ?? "").trim().slice(0, 200),
    company: String(body.company ?? "").trim().slice(0, 160),
    sells: String(body.sells ?? "").trim().slice(0, 80),
    message: String(body.message ?? "").trim().slice(0, 4000),
  };
  if (!lead.name || !EMAIL.test(lead.email) || !lead.company) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const hook = process.env.DEMO_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: "decommerce.site/book-a-demo", ...lead }),
    });
    if (!res.ok) return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  } else {
    console.info("[demo] lead (no DEMO_WEBHOOK_URL set)", { company: lead.company, sells: lead.sells });
  }
  return NextResponse.json({ ok: true });
}
