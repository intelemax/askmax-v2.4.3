// src/capsule/memory.ts
import Redis from "ioredis";
import { HISTORY_PAIRS, TTL_SECONDS, buildSystem } from "./config";

export type Msg = { role: "system" | "user" | "assistant"; content: string };
export type History = Msg[];

export class Memory {
  private client: Redis;
  private key(threadId: string) {
    return `max:redcarpet:thread:${threadId}`;
  }

  constructor(redisUrl: string) {
    if (!redisUrl) throw new Error("Missing REDIS_URL");
    // Upstash over TLS (rediss://). tls {} ensures secure connection in most envs.
    this.client = new (Redis as any)(redisUrl, { tls: {} });
  }

  async load(threadId: string): Promise<History> {
    const raw = await this.client.get(this.key(threadId));
    if (!raw) return [{ role: "system", content: buildSystem() }];
    try {
      const parsed: History = JSON.parse(raw);
      // Ensure the first message is a system prompt
      if (!parsed.length || parsed[0].role !== "system") {
        parsed.unshift({ role: "system", content: buildSystem() });
      }
      return parsed;
    } catch {
      return [{ role: "system", content: buildSystem() }];
    }
  }

  trim(history: History): History {
    const sys = history.find((m) => m.role === "system") ?? {
      role: "system" as const,
      content: buildSystem(),
    };
    const rest = history.filter((m) => m.role !== "system");
    const tail = rest.slice(-(HISTORY_PAIRS * 2)); // last N user/assistant turns
    return [sys, ...tail];
  }

  async save(threadId: string, history: History) {
    await this.client.set(this.key(threadId), JSON.stringify(history), "EX", TTL_SECONDS);
  }
}
