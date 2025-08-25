// src/capsule/engine.ts
import OpenAI from "openai";
import { Memory, Msg } from "./memory";
import { MODEL, TEMPERATURE, MAX_TOKENS, buildSystem } from "./config";

export async function respond(opts: {
  openaiKey: string;
  redisUrl: string;
  threadId: string;
  userText: string;
}): Promise<string> {
  const { openaiKey, redisUrl, threadId, userText } = opts;
  if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");
  if (!redisUrl) throw new Error("Missing REDIS_URL");

  const client = new OpenAI({ apiKey: openaiKey });
  const mem = new Memory(redisUrl);

  // load history (system prompt included)
  let history: Msg[] = await mem.load(threadId);

  // push user turn and trim
  history.push({ role: "user", content: userText });
  history = mem.trim(history);

  // call model
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: MAX_TOKENS,
    messages: history,
  });

  const reply =
    completion.choices?.[0]?.message?.content?.trim() ||
    "I’m here. Give me one clear objective and I’ll move first.";

  // append assistant turn and persist
  history.push({ role: "assistant", content: reply });
  await mem.save(threadId, history);

  return reply;
}
