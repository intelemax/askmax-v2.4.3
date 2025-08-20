import type { NextApiRequest, NextApiResponse } from 'next';
import { askOpenAI, ChatMessage } from '@/lib/chatClient';
import { SYSTEM_PROMPT } from '@/lib/prompts';

const MODEL = process.env.MODEL_FALLBACK || 'gpt-4o-mini';
const NO_OFFERS = (process.env.NO_OFFERS || 'on') === 'on';

function stripOffers(text: string) {
  if (!NO_OFFERS) return text;
  const patterns = [
    /Would you like me[^.?!]*[.?!]/gi,
    /I can (also )?[^.?!]*[.?!]/gi,
    /If you want,? I can[^.?!]*[.?!]/gi,
    /Do you want me to[^.?!]*[.?!]/gi,
  ];
  return patterns.reduce((t, p) => t.replace(p, ''), text).trim();
}

// ---- Minimal intent helpers
function isGreeting(s: string) {
  const t = (s || '').trim().toLowerCase();
  return /^(hi|hello|hey|yo|sup|good\s*(morning|afternoon|evening)|hola|salam)[!. ]*$/.test(t);
}
function isDecisionIntent(s: string) {
  const t = (s || '').toLowerCase();
  return /\b(decide|decision|choose|pick|vs\.?|versus|compare|option|trade[- ]?off|pros? and cons?)\b/.test(t);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(200)
      .json({ answer: '(Server not configured: missing OPENAI_API_KEY. Add it to .env.local and restart.)' });
  }

  const { history = [], shortMode = false, structure = 'general' } = req.body || {};

  // Last user message
  const userTurns = history.filter((m: any) => m?.role === 'user');
  const lastUser = userTurns.length ? String(userTurns[userTurns.length - 1].content || '') : '';

  // 1) Greeting gate — fast, Max-style welcome (no model call)
  if (isGreeting(lastUser) && history.length <= 1) {
    const welcome = shortMode
      ? `Hey — Max here. What are you deciding or trying to build?`
      : [
          `Hey — Max here.`,
          ``,
          `Tell me one of these to start:`,
          `- **Decision** you’re making + options`,
          `- **Spec** you want drafted (inputs + constraints)`,
          `- **Stuck point** that needs a clean next step`,
        ].join('\n');
    return res.status(200).json({ answer: welcome });
  }

  // 2) Structure guard — only apply Silver Bullet™ to actual decisions
  let appliedStructure: 'general' | 'silver_bullet' = structure === 'silver_bullet' && isDecisionIntent(lastUser)
    ? 'silver_bullet'
    : 'general';

  // System headers
  const header: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content:
        appliedStructure === 'silver_bullet'
          ? 'User is making a decision. Respond using the **Silver Bullet™** pattern exactly.'
          : 'Use the default **Answer / Reasoning / Risks / Next 1–3 Actions** structure when applicable.',
    },
    { role: 'system', content: `Model: ${MODEL}.` },
  ];
  if (shortMode) {
    header.unshift({
      role: 'system',
      content: 'SHORT MODE ACTIVE: compress to the smallest correct answer; no extra sections.',
    });
  }

  const convo: ChatMessage[] = [
    ...header,
    ...history
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant'))
      .map((m: any) => ({ role: m.role, content: String(m.content || '') })),
  ];

  try {
    const answer = await askOpenAI(convo, shortMode ? 300 : 900);
    const cleaned = stripOffers(answer);
    return res.status(200).json({ answer: cleaned });
  } catch {
    return res
      .status(200)
      .json({ answer: '(Timeout or API error. Check your model access or network and try again.)' });
  }
}
