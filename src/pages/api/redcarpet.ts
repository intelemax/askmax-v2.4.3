// src/pages/api/redcarpet.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { respond } from "../../capsule/engine";

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
    const { message, threadId } = req.body ?? {};
    const text = (typeof message === "string" ? message : "").trim();
    const tid = (typeof threadId === "string" ? threadId : "").trim();

    if (!text) return res.status(400).json({ ok: false, error: "Empty message" });
    if (!tid) return res.status(400).json({ ok: false, error: "Missing threadId" });

    const reply = await respond({
      openaiKey: process.env.OPENAI_API_KEY || "",
      redisUrl: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL || "",
      threadId: tid,
      userText: text,
    });

    return res.status(200).json({ ok: true, reply });
  } catch (e: any) {
    console.error("capsule error:", e?.message || e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
