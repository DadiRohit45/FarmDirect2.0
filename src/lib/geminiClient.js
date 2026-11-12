/**
 * FarmDirect 2.0 — Google Gemini AI Integration Client
 * 
 * Proxies AI generation through the Django backend (/api/ai/gemini/)
 * ensuring private GEMINI_API_KEY is never exposed in client bundles.
 */

import { getBackendUrl } from './apiConfig.js';

const STORAGE_KEY_GEMINI_KEY = 'farmdirect_gemini_api_key';
const STORAGE_KEY_GEMINI_MODEL = 'farmdirect_gemini_model';

const DEFAULT_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_MODEL) || 'gemini-1.5-flash';

export function getGeminiConfig() {
  if (typeof window === 'undefined') {
    return { apiKey: '', model: DEFAULT_MODEL };
  }

  const storedKey = localStorage.getItem(STORAGE_KEY_GEMINI_KEY);
  const storedModel = localStorage.getItem(STORAGE_KEY_GEMINI_MODEL);

  return {
    apiKey: storedKey || '',
    model: storedModel || DEFAULT_MODEL
  };
}

export function saveGeminiConfig({ apiKey, model }) {
  if (typeof window === 'undefined') return;
  if (apiKey !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI_KEY, apiKey.trim());
  if (model !== undefined) localStorage.setItem(STORAGE_KEY_GEMINI_MODEL, model.trim());
}

/**
 * Generate completion via secure Django backend proxy or client fallback
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
  const model = config.model || DEFAULT_MODEL;

  // 1. Primary Secure Path: Proxy through Django backend (reads GEMINI_API_KEY securely from server environment)
  const backendEndpoint = getBackendUrl('/api/ai/gemini/');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000);

  try {
    const backendRes = await fetch(backendEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, messages, systemPrompt, model }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.text) {
        return {
          text: data.text.trim(),
          model: data.model || model
        };
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Backend Gemini proxy notice (falling back if client key available):', err.message);
  }

  // 2. Client-Side Override Fallback (only if user explicitly provided a personal key in localStorage)
  const clientKey = config.apiKey;
  if (!clientKey) {
    // No backend key and no client override: signal caller to use grounded local synthesis
    return null;
  }

  const directEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${clientKey}`;
  const directController = new AbortController();
  const directTimeoutId = setTimeout(() => directController.abort(), 18000);

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

  try {
    const res = await fetch(directEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: directController.signal
    });

    clearTimeout(directTimeoutId);

    if (!res.ok) {
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
    clearTimeout(directTimeoutId);
    console.warn('Direct Gemini request notice:', err.message);
    return null;
  }
}
