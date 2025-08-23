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

    // Stub reply for now — we'll swap in the real Max backend next.
    const reply = `Max (stub): You said, “${text}”.`;
    return res.status(200).json({ ok: true, reply });
  } catch {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
