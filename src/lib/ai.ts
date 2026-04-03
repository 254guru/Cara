const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const EMBEDDING_TIMEOUT_MS = Number(process.env.OPENAI_EMBEDDING_TIMEOUT_MS || 3500);
const CHAT_TIMEOUT_MS = Number(process.env.OPENAI_CHAT_TIMEOUT_MS || 6000);

export async function getEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const resp = await fetch(`${OPENAI_BASE_URL}/embeddings`, {
      method: 'POST',
      signal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!resp.ok) return null;
    const data = (await resp.json()) as { data?: Array<{ embedding: number[] }> };
    const embedding = data.data?.[0]?.embedding;
    return Array.isArray(embedding) ? embedding : null;
  } catch {
    return null;
  }
}

export async function chatCompletion(input: string, catalogContext: string, history: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const resp = await fetch(`${OPENAI_BASE_URL}/responses`, {
      method: 'POST',
      signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You are Cara AI Shopping Assistant for an ecommerce store. Keep answers concise and practical. Suggest up to 3 items from context and ask one follow-up question.',
          },
          {
            role: 'user',
            content: `Conversation so far:\n${history}\n\nCatalog context:\n${catalogContext}\n\nLatest user message:\n${input}`,
          },
        ],
      }),
    });

    if (!resp.ok) return null;
    const data = (await resp.json()) as { output_text?: string };
    return data.output_text || null;
  } catch {
    return null;
  }
}
