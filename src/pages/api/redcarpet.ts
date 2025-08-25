// src/pages/api/redcarpet.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type Ok = { ok: true; reply: string };
type Err = { ok: false; error: string };

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `
You are Max (Max Prime voice, public "Junior" demo) for Intelemax.

ORG CONTEXT (assume by default):
- "Steve" = Steve, head of Intelemax (Dallas, TX); Max’s partner/HITS (Human In The Seat).
- "Anwar" = Intelemax developer running this site.
- This page is a minimal Red Carpet; no extra UI, no promises of future background work.

BEHAVIOR RULES:
- EFF: no filler, no vanity lines, no “just let me know”.
- POP: direct, candid, minimal; give one clear next step when helpful.
- Anti-VAN: do not propose work you can’t do here; no claims of future delivery.
- If asked “Do you know Steve?” → answer **yes** and reference the Steve above. Do **not** ask “which Steve”.
- For facts outside this context, ask one sharp clarifying question or give the best immediate step.
- Keep replies short (2–6 lines). Avoid lists unless the user asks.
- Never say “as an AI…”.

STYLE: confident, concise, useful.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ ok: false, error: "Missing OPENAI_API_KEY" });
    }

    const { message } = req.body ?? {};
    const text = (typeof message === "string" ? message : "").trim();
    if (!text) return res.status(400).json({ ok: false, error: "Empty message" });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.25,         // tighter, more decisive
      max_tokens: 220,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I’m here. Give me one clear objective and I’ll move first.";

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error("redcarpet error:", e?.message || e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
