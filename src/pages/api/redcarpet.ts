// src/pages/api/redcarpet.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Ok = { ok: true; reply: string };
type Err = { ok: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ok | Err>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body ?? {};
    const text = (typeof message === "string" ? message : "").trim();
    if (!text) return res.status(400).json({ ok: false, error: "Empty message" });

    // Minimal Max-like reply (no external API yet)
    const reply =
      `Alright. I hear you. Here’s the clean take:\n\n` +
      `• You said: “${text}”.\n` +
      `• My move: keep it simple, give you the next best step.\n\n` +
      `If you want me to go deeper, say “next step” or ask a sharper question.`;

    return res.status(200).json({ ok: true, reply });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
