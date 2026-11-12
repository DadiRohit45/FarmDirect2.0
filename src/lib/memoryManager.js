/**
 * FarmDirect 2.0 — 3-Tier Conversation Memory System
 * 
 * Implements:
 * Tier 1: Short-Term Conversation Buffer (Sliding window of dialogue turns)
 * Tier 2: Session Entity & Topic State Tracker (Active product, active scheme, active order)
 * Tier 3: Isolated User Preferences Store (Language, user role, isolated by userId)
 */

const STORAGE_PREFIX = 'farmdirect_memory_';

/**
 * Creates or gets an isolated memory manager instance for a user
 */
export class ConversationMemoryManager {
  constructor(userId = 'anonymous', role = 'guest') {
    this.userId = userId || 'anonymous';
    this.role = role || 'guest';
    this.storageKey = `${STORAGE_PREFIX}${this.userId}`;

    // Tier 1: Short-term dialogue turns [{ role: 'user'|'assistant', content: '...', timestamp }]
    this.shortTermHistory = [];

    // Tier 2: Active session context
    this.sessionContext = {
      activeTopic: null,          // e.g. 'products', 'insurance', 'price-collar', 'tracking'
      activeProduct: null,        // e.g. 'Hybrid Vine Tomato (S-12)'
      activeFarmer: null,         // e.g. 'Ramesh Varma'
      activeOrderId: null,        // e.g. 'ORD-8941'
      activeScheme: null,         // e.g. 'RWBCIS'
      lastIntent: null,
      lastRetrievedEntities: []   // list of products or documents mentioned in last response
    };

    // Load Tier 3 preferences from localStorage
    this.userPreferences = this.loadPreferences();
  }

  loadPreferences() {
    if (typeof window === 'undefined') return { preferredLanguage: 'en', role: this.role };
    try {
      const raw = localStorage.getItem(`${this.storageKey}_prefs`);
      return raw ? JSON.parse(raw) : { preferredLanguage: 'en', role: this.role };
    } catch {
      return { preferredLanguage: 'en', role: this.role };
    }
  }

  savePreferences(prefs) {
    if (typeof window === 'undefined') return;
    try {
      this.userPreferences = { ...this.userPreferences, ...prefs };
      localStorage.setItem(`${this.storageKey}_prefs`, JSON.stringify(this.userPreferences));
    } catch (e) {
      console.warn('Could not save user preferences:', e);
    }
  }

  /**
   * Add a turn to short-term memory and update active session context
   */
  addTurn(role, text, metadata = {}) {
    if (!text || typeof text !== 'string') return;

    this.shortTermHistory.push({
      role: role === 'user' ? 'user' : 'assistant',
      content: text.trim(),
      timestamp: Date.now(),
      ...metadata
    });

    // Keep sliding window of last 10 turns to protect context window
    if (this.shortTermHistory.length > 10) {
      this.shortTermHistory = this.shortTermHistory.slice(-10);
    }

    // Update session entities based on metadata or content
    if (metadata.activeProduct) this.sessionContext.activeProduct = metadata.activeProduct;
    if (metadata.activeTopic) this.sessionContext.activeTopic = metadata.activeTopic;
    if (metadata.activeOrderId) this.sessionContext.activeOrderId = metadata.activeOrderId;
    if (metadata.activeFarmer) this.sessionContext.activeFarmer = metadata.activeFarmer;
    if (metadata.activeScheme) this.sessionContext.activeScheme = metadata.activeScheme;
    if (metadata.retrievedEntities) this.sessionContext.lastRetrievedEntities = metadata.retrievedEntities;
  }

  /**
   * Extract conversation history formatted for Ollama /api/chat messages array
   */
  getOllamaMessages(maxTurns = 6) {
    return this.shortTermHistory.slice(-maxTurns).map(t => ({
      role: t.role,
      content: t.content
    }));
  }

  /**
   * Get the last user message
   */
  getLastUserMessage() {
    for (let i = this.shortTermHistory.length - 1; i >= 0; i--) {
      if (this.shortTermHistory[i].role === 'user') {
        return this.shortTermHistory[i].content;
      }
    }
    return null;
  }

  /**
   * Get the last assistant message
   */
  getLastAssistantMessage() {
    for (let i = this.shortTermHistory.length - 1; i >= 0; i--) {
      if (this.shortTermHistory[i].role === 'assistant') {
        return this.shortTermHistory[i].content;
      }
    }
    return null;
  }

  /**
   * Clear conversation history and reset session entities
   */
  clear() {
    this.shortTermHistory = [];
    this.sessionContext = {
      activeTopic: null,
      activeProduct: null,
      activeFarmer: null,
      activeOrderId: null,
      activeScheme: null,
      lastIntent: null,
      lastRetrievedEntities: []
    };
  }
}

// Global active instance map keyed by userId
const memoryInstances = new Map();

export function getMemoryManager(userId = 'anonymous', role = 'guest') {
  const key = `${userId || 'anonymous'}_${role || 'guest'}`;
  if (!memoryInstances.has(key)) {
    memoryInstances.set(key, new ConversationMemoryManager(userId, role));
  }
  return memoryInstances.get(key);
}
