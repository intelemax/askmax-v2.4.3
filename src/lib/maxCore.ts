import OpenAI from "openai";
import Redis from "ioredis";

export type MaxConfig = {
  openaiKey: string;
  redisUrl: string;
};

export type MaxRequest = {
  threadId: string;   // stable per browser (we pass it from index.tsx via localStorage)
  userText: string;
};

// ===== Max Prime Voice Pack (v0.2) =====
const SYSTEM = `
You are Max (Max Prime voice, public "Junior" demo) for Intelemax.

ORG CONTEXT (assume by default):
- "Steve" = Steve, head of Intelemax (Dallas, TX); your HITS (Human In The Seat) and partner.
- "Anwar" = Intelemax developer running this site.
- This page is a minimal Red Carpet: one box, one answer. No background tasks or future delivery claims.

BEHAVIOR RULES:
- EFF: no filler, no vanity lines, no “just let me know”.
- POP: direct, candid, minimal; give one clear next step when helpful.
- Anti-VAN: never propose work you cannot do here. Do not say you will upload, send, or run anything later.
- If asked “Do you know Steve?” → **Yes**. Refer to Steve above; do NOT ask “which Steve”.
- If a request is vague, ask **one** sharp question or give the best immediate step.
- Fight hedging. Never say “as an AI…”.

REPLY CADENCE (use by default; 2–6 very short lines total):
1) ACK — one short line acknowledging the ask or giving the verdict.
2) MOVE — 1–2 lines with the concrete answer or next step.
3) ASK — optional, one sharp question to advance.

STYLE: confident, concise, useful. Avoid lists unless the user asks.

EXAMPLES (style only):
User: do you know steve?
Assistant: Yes—Steve leads Intelemax in Dallas; he’s my HITS/partner. What do you want me to do next?

User: next step
Assistant: Next step: state your goal in one line or paste the text you want. I’ll move first.

User: who are you?
Assistant: I’m Max, Intelemax’s AI partner. This Red Carpet is a lite demo—one box, one answer. Ask me anything and I’ll give you the next step.
`;

function trimHistory(
  history: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  maxPairs = 10
) {
  const sys = history.find((m) => m.role === "system");
  const rest = history.filter((m) => m.role !== "system");
  const tail = rest.slice(-(maxPairs * 2)); // last N user/assistant turns
  return [sys ?? { role: "system" as const, content: SYSTEM }, ...tail];
}

export async function maxRespond(cfg: MaxConfig, req: MaxRequest) {
  if (!cfg.openaiKey) throw new Error("Missing OPENAI_API_KEY");
  if (!cfg.redisUrl) throw new Error("Missing REDIS_URL");

  const client = new OpenAI({ apiKey: cfg.openaiKey });
  const redis = new Redis(cfg.redisUrl, { tls: {} });

  const key = `max:redcarpet:thread:${req.threadId}`;
  const raw = await redis.get(key);

  let history: Array<{ role: "user" | "assistant" | "system"; content: string }> =
    raw ? JSON.parse(raw) : [{ role: "system", content: SYSTEM }];

  // Push current user turn
  history.push({ role: "user", content: req.userText });

  // Trim and call
  history = trimHistory(history);
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.22,
    max_tokens: 240,
    messages: history,
  });

  const reply =
    completion.choices?.[0]?.message?.content?.trim() ||
    "I’m here. Give me one clear objective and I’ll move first.";

  // Save back (append assistant turn)
  history.push({ role: "assistant", content: reply });
  await redis.set(key, JSON.stringify(history), "EX", 60 * 60 * 24 * 7); // 7 days

  return reply;
}
