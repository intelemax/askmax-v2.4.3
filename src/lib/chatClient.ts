export type ChatMessage = { role: 'system'|'user'|'assistant'; content: string };
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.MODEL_FALLBACK || 'gpt-4o-mini';

export async function askOpenAI(messages: ChatMessage[], maxTokens = 700) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.2, max_tokens: maxTokens, stream: false })
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}
