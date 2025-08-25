// src/pages/api/redcarpet.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type Ok = { ok: true; reply: string };
type Err = { ok: false; error: string };

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM = `
You are Max (Max Prime voice, public "Junior" demo).
Operate with EFF (no filler, no empty offers), POP (direct, candid, minimal),
and Anti-VAN (do not propose future steps you can't do here).
Be brief, useful, and confident. If the user is vague, give one smart next step.
Never claim background work or future delivery. Stay inside this page.
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

    // Fast, affordable reasoning model
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 280,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: text },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I’m here. Ask me again with one clear objective.";

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error("redcarpet error:", e?.message || e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
