/**
 * FarmDirect 2.0 - Ollama Local LLM Integration Client
 * 
 * Provides:
 * 1. Resilient connection management to local Ollama instance (via Vite proxy /api/ollama or direct http://localhost:11434)
 * 2. Dynamic model discovery via /api/tags (llama3.2, llama3, mistral, deepseek-r1, qwen2.5, phi3, etc.)
 * 3. Real-time token streaming with fallback to non-streaming execution
 * 4. Grounded prompt assembly with zero-hallucination constraints
 * 5. Robust offline detection with graceful fallback to deterministic local RAG
 */

const STORAGE_KEY_URL = 'farmdirect_ollama_url';
const STORAGE_KEY_MODEL = 'farmdirect_ollama_model';
const STORAGE_KEY_ENABLED = 'farmdirect_ollama_enabled';

// Default configuration
const DEFAULT_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OLLAMA_URL) || '/api/ollama';
const DEFAULT_MODEL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OLLAMA_MODEL) || 'llama3.2';

/**
 * Get current Ollama settings from localStorage or defaults
 */
export function getOllamaConfig() {
  if (typeof window === 'undefined') {
    return { url: DEFAULT_URL, model: DEFAULT_MODEL, enabled: true };
  }

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL);
  const storedModel = localStorage.getItem(STORAGE_KEY_MODEL);
  const storedEnabled = localStorage.getItem(STORAGE_KEY_ENABLED);

  return {
    url: storedUrl || DEFAULT_URL,
    model: storedModel || DEFAULT_MODEL,
    enabled: storedEnabled !== null ? storedEnabled === 'true' : true
  };
}

/**
 * Persist Ollama settings
 */
export function saveOllamaConfig({ url, model, enabled }) {
  if (typeof window === 'undefined') return;
  if (url !== undefined) localStorage.setItem(STORAGE_KEY_URL, url);
  if (model !== undefined) localStorage.setItem(STORAGE_KEY_MODEL, model);
  if (enabled !== undefined) localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
}

// In-memory status cache to avoid spamming network requests
let cachedHealthStatus = null;
let lastHealthCheckTime = 0;
const HEALTH_CACHE_TTL_MS = 15000; // 15 seconds

/**
 * Check if Ollama service is reachable and retrieve available models
 * @param {string} [customUrl] - Optional URL to test
 * @param {boolean} [forceRefresh] - Skip cache
 */
export async function checkOllamaHealth(customUrl = null, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && !customUrl && cachedHealthStatus && (now - lastHealthCheckTime < HEALTH_CACHE_TTL_MS)) {
    return cachedHealthStatus;
  }

  const config = getOllamaConfig();
  const urlToTry = customUrl || config.url || DEFAULT_URL;

  // Possible candidates if default proxy or direct fails
  const endpointsToTry = [
    urlToTry,
    urlToTry === '/api/ollama' ? 'http://localhost:11434' : '/api/ollama'
  ].filter(Boolean);

  let detectedResult = null;

  for (const endpoint of endpointsToTry) {
    try {
      const cleanBase = endpoint.replace(/\/+$/, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${cleanBase}/api/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const modelsList = (data.models || []).map(m => m.name || m.model).filter(Boolean);
        
        let activeModel = config.model;
        // If current configured model isn't in modelsList, pick the first available or keep configured
        if (modelsList.length > 0 && !modelsList.some(m => m.startsWith(activeModel))) {
          activeModel = modelsList[0];
        }

        detectedResult = {
          isOnline: true,
          url: cleanBase,
          models: modelsList,
          activeModel: activeModel,
          error: null
        };
        break;
      }
    } catch {
      // Endpoint not reachable, try next candidate
    }
  }

  if (!detectedResult) {
    detectedResult = {
      isOnline: false,
      url: urlToTry,
      models: [],
      activeModel: config.model,
      error: 'Ollama service offline or unreachable at ' + urlToTry
    };
  }

  cachedHealthStatus = detectedResult;
  lastHealthCheckTime = now;
  return detectedResult;
}

/**
 * Generate completion via Ollama with optional token streaming
 * @param {Object} params
 * @param {string} [params.prompt] - Single user message (fallback)
 * @param {Array} [params.messages] - Multi-turn conversation messages array [{ role, content }]
 * @param {string} params.systemPrompt - System instruction with RAG grounding
 * @param {Object} [params.inferenceOptions] - Adaptive sampling parameters
 * @param {function} [params.onChunk] - Callback for streaming tokens: (fullText, token) => void
 * @param {AbortSignal} [params.signal] - Abort signal
 * @returns {Promise<{ text: string, model: string } | null>}
 */
export async function generateOllamaResponse({
  prompt = '',
  messages = null,
  systemPrompt,
  inferenceOptions = {},
  onChunk = null,
  signal = null
}) {
  const config = getOllamaConfig();
  if (!config.enabled) {
    return null;
  }

  const health = await checkOllamaHealth(config.url);
  if (!health.isOnline) {
    return null;
  }

  const baseUrl = health.url.replace(/\/+$/, '');
  const modelToUse = config.model || health.activeModel || DEFAULT_MODEL;

  // Build adaptive inference parameters
  const samplingOptions = {
    temperature: inferenceOptions.temperature !== undefined ? inferenceOptions.temperature : 0.20,
    top_p: inferenceOptions.top_p !== undefined ? inferenceOptions.top_p : 0.9,
    repeat_penalty: inferenceOptions.repeat_penalty !== undefined ? inferenceOptions.repeat_penalty : 1.15,
    num_ctx: inferenceOptions.num_ctx || 4096,
    num_predict: inferenceOptions.num_predict || 800
  };

  // Build messages array
  let dialogueMessages = [];
  if (Array.isArray(messages) && messages.length > 0) {
    dialogueMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
  } else {
    dialogueMessages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];
  }

  // Set up request controller for timeout if no external signal provided
  const internalController = new AbortController();
  const effectiveSignal = signal || internalController.signal;
  const timeoutId = setTimeout(() => internalController.abort(), 60000); // 60s timeout for local inference

  try {
    // 1. First try modern Ollama /api/chat endpoint
    const chatPayload = {
      model: modelToUse,
      messages: dialogueMessages,
      stream: typeof onChunk === 'function',
      options: samplingOptions
    };

    let response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatPayload),
      signal: effectiveSignal
    });


    // 2. If /api/chat returns 404, fall back to /api/generate
    if (response.status === 404) {
      const generatePayload = {
        model: modelToUse,
        system: systemPrompt,
        prompt: prompt,
        stream: typeof onChunk === 'function',
        options: {
          temperature: 0.25,
          top_p: 0.9,
          num_ctx: 4096
        }
      };

      response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatePayload),
        signal: effectiveSignal
      });
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Ollama responded with HTTP ${response.status}`);
      return null;
    }

    // 3. Handle Streaming Response
    if (typeof onChunk === 'function' && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last incomplete slice in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            // Ollama /api/chat sends { message: { content: "..." } }
            // Ollama /api/generate sends { response: "..." }
            const chunk = parsed.message?.content || parsed.response || '';
            if (chunk) {
              accumulatedText += chunk;
              onChunk(accumulatedText, chunk);
            }
          } catch {
            // Incomplete JSON line in stream chunk, ignore
          }
        }
      }

      // Process any trailing line in buffer
      if (buffer.trim()) {
        try {
          const parsed = JSON.parse(buffer.trim());
          const chunk = parsed.message?.content || parsed.response || '';
          if (chunk) {
            accumulatedText += chunk;
            onChunk(accumulatedText, chunk);
          }
        } catch {}
      }

      if (accumulatedText.trim()) {
        return {
          text: accumulatedText.trim(),
          model: modelToUse
        };
      }
    }

    // 4. Handle Non-streaming Response
    const json = await response.json();
    const resultText = json.message?.content || json.response;

    if (resultText && resultText.trim()) {
      return {
        text: resultText.trim(),
        model: modelToUse
      };
    }

    return null;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Ollama generation error, falling back to local RAG engine:', err);
    return null;
  }
}
