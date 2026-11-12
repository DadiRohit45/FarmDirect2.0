/**
 * FarmDirect 2.0 — AI Evaluation & Self-Improving Quality Tracker
 * 
 * Logs diagnostic telemetry for every interaction:
 * 1. Query latency (milliseconds)
 * 2. Intent detection accuracy
 * 3. Retrieval fused RRF scores & chunk IDs
 * 4. User feedback (thumbs up / thumbs down)
 * 5. Failed or low-confidence queries
 */

const STORAGE_KEY_TELEMETRY = 'farmdirect_ai_telemetry';
const MAX_LOG_ENTRIES = 50;

export function recordQueryTelemetry({
  query,
  rewrittenQuery,
  intent,
  retrievedDocIds = [],
  relevanceScore = 0,
  latencyMs = 0,
  engine = 'Local-RAG-Engine',
  isSuccessful = true
}) {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEMETRY);
    const logs = raw ? JSON.parse(raw) : [];

    const entry = {
      id: `tel-${Date.now()}`,
      timestamp: new Date().toISOString(),
      query: (query || '').slice(0, 120),
      rewrittenQuery: (rewrittenQuery || '').slice(0, 120),
      intent: intent?.type || 'UNKNOWN',
      retrievedDocIds,
      relevanceScore: Math.round(relevanceScore * 100) / 100,
      latencyMs: Math.round(latencyMs),
      engine,
      isSuccessful,
      feedback: null
    };

    logs.unshift(entry);
    if (logs.length > MAX_LOG_ENTRIES) {
      logs.length = MAX_LOG_ENTRIES;
    }

    localStorage.setItem(STORAGE_KEY_TELEMETRY, JSON.stringify(logs));
  } catch (err) {
    console.warn('Could not record AI telemetry:', err);
  }
}

export function recordUserFeedback(telemetryId, isPositive) {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEMETRY);
    if (!raw) return;
    const logs = JSON.parse(raw);
    const item = logs.find(l => l.id === telemetryId || l.id.startsWith(telemetryId));
    if (item) {
      item.feedback = isPositive ? 'positive' : 'negative';
      localStorage.setItem(STORAGE_KEY_TELEMETRY, JSON.stringify(logs));
    }
  } catch (err) {
    console.warn('Could not record feedback:', err);
  }
}

export function getTelemetrySummary() {
  if (typeof window === 'undefined') return { total: 0, avgLatencyMs: 0, successRate: 100 };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_TELEMETRY);
    if (!raw) return { total: 0, avgLatencyMs: 0, successRate: 100 };
    const logs = JSON.parse(raw);
    if (logs.length === 0) return { total: 0, avgLatencyMs: 0, successRate: 100 };

    const total = logs.length;
    const avgLatencyMs = Math.round(logs.reduce((acc, l) => acc + (l.latencyMs || 0), 0) / total);
    const successful = logs.filter(l => l.isSuccessful).length;
    const successRate = Math.round((successful / total) * 100);

    return { total, avgLatencyMs, successRate };
  } catch {
    return { total: 0, avgLatencyMs: 0, successRate: 100 };
  }
}
