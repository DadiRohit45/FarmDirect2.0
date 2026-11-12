/**
 * FarmDirect 2.0 — Google Gemini AI Integration Client
 * 
 * Replaces Ollama with Google Gemini API for intelligent, grounded, and conversational responses.
 */

const STORAGE_KEY_GEMINI_KEY = 'farmdirect_gemini_api_key';
const STORAGE_KEY_GEMINI_MODEL = 'farmdirect_gemini_model';

const DEFAULT_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) || 'gemini-1.5-flash';

export function getGeminiConfig() {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  if (typeof window === 'undefined') {
    return { apiKey: envKey, model: DEFAULT_MODEL };
  }

  const storedKey = localStorage.getItem(STORAGE_KEY_GEMINI_KEY);
  const storedModel = localStorage.getItem(STORAGE_KEY_GEMINI_MODEL);

  return {
    apiKey: storedKey || envKey || '',
    model: storedModel || DEFAULT_MODEL
  };
}

export function saveGeminiConfig({ apiKey, model }) {
  if (typeof window === 'undefined') return;
  if (apiKey !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI_KEY, apiKey.trim());
  if (model !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI_MODEL, model.trim());
}

/**
 * Generate completion via Google Gemini REST API
 * @param {Object} params
 * @param {string} params.prompt - Single prompt or latest query
 * @param {Array} [params.messages] - Multi-turn conversation messages array [{ role: 'user'|'assistant', content: string }]
 * @param {string} params.systemPrompt - System instructions and groundings
 * @returns {Promise<{ text: string, model: string } | null>}
 */
export async function generateGeminiResponse({
  prompt = '',
  messages = [],
  systemPrompt = ''
}) {
  const config = getGeminiConfig();
  const apiKey = config.apiKey;

  if (!apiKey) {
    // No API key provided; signal caller to use grounded local synthesis
    return null;
  }

  const model = config.model || DEFAULT_MODEL;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Format messages for Gemini API
  const contents = [];
  if (Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages) {
      if (msg.role === 'system') continue;
      const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
      const text = typeof msg.content === 'string' ? msg.content : (msg.text || '');
      if (text.trim()) {
        contents.push({
          role,
          parts: [{ text }]
        });
      }
    }
  }

  // Ensure latest user prompt is present
  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
  }

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 1000,
      topP: 0.95
    }
  };

  if (systemPrompt) {
    payload.system_instruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.text();
      console.warn('Gemini API returned non-OK status:', res.status, errBody);
      return null;
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const responseText = candidate?.content?.parts?.map(p => p.text).join('') || '';

    if (!responseText) {
      return null;
    }

    return {
      text: responseText.trim(),
      model
    };
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Gemini request failed:', err.message);
    return null;
  }
}

