/**
 * FarmDirect 2.0 — Advanced AI & Grounded Hybrid RAG Engine
 * 
 * Orchestrates:
 * 1. Strict Privacy Firewall (Zero-leakage PII & injection protection)
 * 2. Contextual Query Rewriter & Multi-Tier Memory (Pronoun & follow-up resolution)
 * 3. Live Structured DataStore (Instant, reliable product catalog & pricing)
 * 4. Hybrid Dense Vector + BM25 RRF Retrieval from Capstone & Domain Docs
 * 5. Adaptive Ollama Generation with General-Knowledge Routing & Deterministic Fallback
 * 6. Self-Improving Telemetry & Diagnostics
 */

import { RAG_KNOWLEDGE_BASE } from './ragKnowledgeBase.js';
import { generateGeminiResponse } from './geminiClient.js';
import { validateQuerySecurity, EXACT_SECURITY_REFUSAL, sanitizeContextForPrompt } from './privacyGuard.js';
import { getMemoryManager } from './memoryManager.js';
import { rewriteContextualQuery, classifyIntent, isQueryDomainRelated } from './queryRewriter.js';
import { hybridRetrieveChunks } from './hybridRAG.js';
import { AI_TOOLS } from './toolRegistry.js';
import { recordQueryTelemetry } from './evaluationTracker.js';

export const FORMAL_UNRELATED_ERROR_EN = 
`I apologize, but I am unable to answer this question. As the FarmDirect 2.0 AI Assistant, I can only assist with inquiries related to FarmDirect 2.0, fresh agricultural produce, farmer operations, mandi pricing, cold-chain delivery, and platform features.

Please ask a question related to FarmDirect services or explore our platform features below:
• [Open Fresh Market](#customer)
• [Farmer Harvest Portal](#farmer)
• [RWBCIS Crop Insurance Scheme](#rwbcis)
• [Live Order Tracking](#tracking)`;

export const FORMAL_UNRELATED_ERROR_TE = 
`క్షమించండి, నేను ఈ ప్రశ్నకు సమాధానం ఇవ్వలేను. ఫామ్‌డైరెక్ట్ 2.0 AI సహాయకుడిగా, నేను కేవలం ఫామ్‌డైరెక్ట్ 2.0, తాజా వ్యవసాయ ఉత్పత్తులు, ధరలు, రైతు సేవలు, శీతల రవాణా మరియు వేదిక ఫీచర్లకు సంబంధించిన ప్రశ్నలకు మాత్రమే సమాధానం ఇవ్వగలను.

దయచేసి ఫామ్‌డైరెక్ట్ కు సంబంధించిన ప్రశ్నలను అడగండి:
• [తాజా మార్కెట్](#customer)
• [రైతు పోర్టల్](#farmer)
• [RWBCIS పంట బీమా](#rwbcis)
• [లైవ్ ఆర్డర్ ట్రాకింగ్](#tracking)`;

// Domain stop words to ignore in BM25 scoring
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'what', 'how', 'why', 'when', 'where', 'who', 'which', 'can',
  'please', 'tell', 'me', 'about', 'explain', 'give', 'does', 'do', 'i', 'my', 'you'
]);

// Multilingual & domain synonym dictionary for backward compatibility
const SYNONYMS = {
  'insurance': ['rwbcis', 'scheme', 'bima', 'weather', 'climate', 'parametric', 'dbt', 'subsidy', 'premium'],
  'rwbcis': ['insurance', 'weather', 'bima', 'kasimkota', 'anandapuram', 'deficit', 'subsidy', 'scheme'],
  'bima': ['rwbcis', 'insurance', 'weather', 'scheme'],
  'weather': ['rwbcis', 'insurance', 'climate', 'temperature', 'rainfall', 'cyclone', 'aws', 'station'],
  'subsidy': ['rwbcis', 'premium', 'government', 'share', 'cost'],
  'tracking': ['order', 'delivery', 'reefer', 'porter', 'driver', 'status', 'transit', 'stepper', 'cold chain'],
  'track': ['tracking', 'order', 'delivery', 'reefer', 'driver', 'van', 'transit'],
  'delivery': ['tracking', 'dispatch', 'porter', 'reefer', 'van', 'arrival', 'steps'],
  'reefer': ['tracking', 'cold chain', 'temperature', 'van', 'porter', 'carrier', 'truck'],
  'temperature': ['reefer', 'cold chain', 'telemetry', 'cargo', '10.4', 'iot'],
  'driver': ['porter', 'vehicle', 'suresh maddala', 'contact', 'ap-31-tv-8821'],
  'price': ['collar', 'formula', 'mandi', 'volatility', 'floor', 'ceiling', 'p_settle', 'risk pool'],
  'pricing': ['collar', 'formula', 'mandi', 'apmc', 'volatility', 'floor', 'ceiling'],
  'collar': ['price', 'formula', 'volatility', 'bounding', '85%', '115%', 'risk pool'],
  'formula': ['collar', 'matching', 'math', 'p_settle', 'gale-shapley', 'algorithm'],
  'mandi': ['apmc', 'anandapuram', 'anakapalli', 'commission', 'spot price', 'collar'],
  'farmer': ['blind yield', 'harvest', 'e-crop', 'upi', 'escrow', 'crates', 'qr bags', 'weighbridge'],
  'harvest': ['blind yield', 'crates', 'sunrise', 'dawn', 'farmer', 'yield entry'],
  'yield': ['blind yield', 'harvest', 'quantity', 'acreage', 'farmer'],
  'upi': ['escrow', 'payout', 'settlement', 'weighbridge', 'instant', '6 seconds'],
  'payout': ['upi', 'escrow', 'settlement', 'instant', 'payment', 'money'],
  'kirana': ['hub', 'micro depot', 'mvp colony', 'seethammadhara', 'dual otp', 'pickup', 'crates'],
  'hub': ['kirana', 'micro depot', 'depot', 'cluster', 'weighbridge', 'intake'],
  'otp': ['dual otp', 'handshake', 'pickup', 'verification', 'fd-4821', 'pin'],
  'bulk': ['institutional', 'forward contract', 'hotel', 'novotel', 'canteen', '50kg', 'tier discount'],
  'customer': ['retail', 'fresh', 'pesticide', 'vegetables', 'basket', 'replacement', 'market'],
  'residue': ['pesticide', 'chemical', 'lab report', '0.00%', 'quality'],
  'admin': ['credentials', 'login', 'email', 'password', 'supabase', 'admin.farmdirect.in'],
  'password': ['admin', 'credentials', 'login', 'security', '123456789'],
  'రైతు': ['farmer', 'harvest', 'blind yield'],
  'బీమా': ['rwbcis', 'insurance', 'weather'],
  'ధర': ['price', 'collar', 'pricing'],
  'ట్రాకింగ్': ['tracking', 'delivery', 'order'],
  'ఆర్డర్': ['order', 'delivery', 'tracking'],
  'కిరాణా': ['kirana', 'hub', 'depot']
};

/**
 * Tokenize a text string into normalized root tokens
 */
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0C00-\u0C7F]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Expand query tokens with domain synonyms
 */
export function expandTokens(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    if (SYNONYMS[token]) {
      for (const syn of SYNONYMS[token]) {
        expanded.add(syn);
      }
    }
  }
  return Array.from(expanded);
}

/**
 * RAG Retriever (BM25 baseline maintained for compatibility)
 */
export function retrieveRelevantChunks(query, userRole = null, topK = 3) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];
  const searchTokens = expandTokens(queryTokens);

  const scored = RAG_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    const titleTokens = tokenize(chunk.title);
    const keywordTokens = chunk.keywords.flatMap(kw => tokenize(kw));
    const contentTokens = tokenize(chunk.content);

    for (const token of searchTokens) {
      if (titleTokens.includes(token)) score += 5.0;
      if (keywordTokens.includes(token)) score += 3.0;
      const freq = contentTokens.filter(t => t === token).length;
      score += Math.min(freq, 4) * 1.0;
    }

    const cleanQuery = query.toLowerCase().trim();
    if (cleanQuery.length > 4 && chunk.content.toLowerCase().includes(cleanQuery)) {
      score += 8.0;
    }

    if (userRole) {
      const role = userRole.toLowerCase();
      if (role === 'farmer' && (chunk.category === 'farmer' || chunk.category === 'schemes' || chunk.category === 'pricing')) {
        score += 2.0;
      } else if (role === 'consumer' && (chunk.category === 'customer' || chunk.category === 'bulk' || chunk.category === 'logistics')) {
        score += 2.0;
      } else if (role === 'kirana' && (chunk.category === 'kirana' || chunk.category === 'logistics')) {
        score += 2.0;
      }
    }

    return { chunk, score };
  });

  return scored
    .filter(item => item.score > 1.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => ({ ...item.chunk, relevanceScore: item.score }));
}

/**
 * Detects whether the user explicitly asks for a link, URL, portal, page, or navigation
 */
export function userAskedForLink(query) {
  if (!query || typeof query !== 'string') return false;
  const q = query.toLowerCase().trim();

  // 1. Explicit link request words
  if (/\b(link|links|url|urls|website|portal|webpage)\b/i.test(q)) {
    return true;
  }

  // 2. Direct navigation commands
  if (/\b(take\s+me\s+to|direct\s+me\s+to|navigate\s+to|go\s+to|redirect\s+to)\b/i.test(q)) {
    return true;
  }

  // 3. Opening or accessing a page or feature
  if (
    /^(open|launch|visit)\s+(the\s+)?(market|portal|dashboard|page|store|tracker|tracking|desk|hub|app|customer|farmer|kirana|bulk|rwbcis|login|register)/i.test(q) ||
    /\b(how\s+(can\s+i|do\s+i|to)\s+(open|access|visit|go\s+to))\b/i.test(q) ||
    /\b(where\s+(can\s+i|do\s+i|to)\s+(open|access|visit|find\s+the\s+link))\b/i.test(q) ||
    /\b(show|give|share|send|provide)\s+(me\s+)?(the\s+)?(link|url|portal|page|website)\b/i.test(q)
  ) {
    return true;
  }

  // 4. Telugu navigation terms
  if (/\b(లింక్|పోర్టల్|వెబ్‌సైట్|ఓపెన్\s+చేయి)\b/i.test(q)) {
    return true;
  }

  return false;
}

/**
 * Strips markdown links and buttons, returning a pure text message
 */
export function stripMarkdownLinks(text) {
  if (!text) return '';

  // Remove standalone link lines and bulleted link lines
  let cleaned = text
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      if (/^(\s*[-•*]?\s*)?\[[^\]]+\]\(#?[a-zA-Z0-9_\-\/:]+\)(\s*[•·,\-]?\s*)*$/i.test(trimmed)) {
        return false;
      }
      if (/^(Quick Links|Features|Explore Features|ఫీచర్లు):?$/i.test(trimmed)) {
        return false;
      }
      return true;
    })
    .join('\n');

  // Convert inline links like "[Fresh Market](#customer)" to plain "Fresh Market"
  cleaned = cleaned.replace(/\[([^\]]+)\]\(#?[a-zA-Z0-9_\-\/:]+\)/g, '$1');

  // Clean excessive blank lines
  return cleaned.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Ensures feature links are provided ONLY if the user asked for a link.
 * If the user did not ask for a link, strips all links and returns a clean text message.
 */
export function ensureFeatureLink(text, query = '', retrievedChunks = []) {
  if (!text) return '';

  // RULE: Give links ONLY when user asks for them. If not asked for a link, return pure text message.
  if (!userAskedForLink(query)) {
    return stripMarkdownLinks(text);
  }

  // If text already includes a markdown link to a hash or url, return as is
  if (/\[[^\]]+\]\(#?[a-zA-Z0-9_\-\/:]+\)/.test(text)) {
    return text;
  }

  const qLower = (query || '').toLowerCase();

  // 1. Match specific feature keywords in user prompt
  if (qLower.includes('rwbcis') || qLower.includes('insurance') || qLower.includes('bima') || qLower.includes('crop protection') || qLower.includes('weather scheme')) {
    return `${text}\n\n[RWBCIS Crop Insurance Scheme](#rwbcis)`;
  }
  if (qLower.includes('track') || qLower.includes('reefer') || qLower.includes('delivery') || qLower.includes('deliver') || qLower.includes('driver') || qLower.includes('transit') || qLower.includes('cold chain') || qLower.includes('where is my order')) {
    return `${text}\n\n[Live Order Tracking](#tracking)`;
  }
  if (qLower.includes('farmer') || qLower.includes('sell') || qLower.includes('harvest') || qLower.includes('yield') || qLower.includes('upi') || qLower.includes('escrow') || qLower.includes('payout') || qLower.includes('weighbridge')) {
    return `${text}\n\n[Farmer Harvest Portal](#farmer)`;
  }
  if (qLower.includes('kirana') || qLower.includes('hub') || qLower.includes('depot') || qLower.includes('dual otp') || qLower.includes('otp') || qLower.includes('pickup')) {
    return `${text}\n\n[Kirana Hub Portal](#kirana)`;
  }
  if (qLower.includes('bulk') || qLower.includes('wholesale') || qLower.includes('institution') || qLower.includes('50kg') || qLower.includes('hotel') || qLower.includes('canteen')) {
    return `${text}\n\n[Bulk Procurement Desk](#bulk)`;
  }
  if (qLower.includes('collar') || qLower.includes('p_settle') || qLower.includes('floor') || qLower.includes('ceiling') || qLower.includes('15%') || qLower.includes('price protect')) {
    return `${text}\n\n[Price Collar Analysis](#farmer)`;
  }
  if (qLower.includes('buy') || qLower.includes('order') || qLower.includes('price') || qLower.includes('vegetable') || qLower.includes('veggie') || qLower.includes('tomato') || qLower.includes('market') || qLower.includes('cart') || qLower.includes('fresh')) {
    return `${text}\n\n[Open Fresh Market](#customer)`;
  }
  if (qLower.includes('login') || qLower.includes('sign in') || qLower.includes('register') || qLower.includes('account') || qLower.includes('signup')) {
    return `${text}\n\n[Sign In / Register](#login)`;
  }

  // 2. Fallback based on retrieved knowledge chunks
  if (retrievedChunks && retrievedChunks.length > 0) {
    const primary = retrievedChunks[0];
    if (primary.action) {
      return `${text}\n\n[${primary.action.label.replace(/^👉\s*/, '').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}](${primary.action.hash})`;
    }
    const cat = primary.category;
    if (cat === 'schemes') return `${text}\n\n[RWBCIS Crop Insurance Scheme](#rwbcis)`;
    if (cat === 'logistics') return `${text}\n\n[Live Order Tracking](#tracking)`;
    if (cat === 'farmer') return `${text}\n\n[Farmer Harvest Portal](#farmer)`;
    if (cat === 'pricing') return `${text}\n\n[Price Collar Analysis](#farmer)`;
    if (cat === 'kirana') return `${text}\n\n[Kirana Hub Portal](#kirana)`;
    if (cat === 'bulk') return `${text}\n\n[Bulk Procurement Desk](#bulk)`;
    if (cat === 'customer' || cat === 'products') return `${text}\n\n[Open Fresh Market](#customer)`;
  }

  // 3. General overview / what is FarmDirect
  if (qLower.includes('farmdirect') || qLower.includes('overview') || qLower.includes('platform') || qLower.includes('app') || qLower.includes('what is')) {
    return `${text}\n\n[FarmDirect Overview](#home) • [Open Fresh Market](#customer)`;
  }

  return `${text}\n\n[Open Fresh Market](#customer) • [Farmer Harvest Portal](#farmer)`;
}

/**
 * Grounded Local RAG Synthesizer (Concise, prompt-accurate responses with feature links)
 */
export function synthesizeLocalRAGResponse(query, retrievedChunks = [], userRole = null, isTelugu = false, intent = null) {
  const q = (query || '').trim();
  const qLower = q.toLowerCase();
  const intentType = intent?.type || '';

  // 1. CONVERSATIONAL PLEASANTRIES & GREETINGS
  if (
    qLower.includes('how are you') ||
    qLower.includes("how're you") ||
    qLower.includes('how are u') ||
    qLower.includes('how do you do') ||
    qLower.includes('how is it going') ||
    qLower.includes("what's up") ||
    qLower.includes('whats up')
  ) {
    return {
      text: isTelugu
        ? `నేను బాగున్నాను, ధన్యవాదాలు! ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?`
        : `I'm doing well, thank you! How can I help you today?`,
      sources: [],
      actions: []
    };
  }

  if (
    /^(hi|hello|hey|namaste|namaskaram|vanakkam|good\s+(morning|afternoon|evening|day)|greetings|yo)\b/i.test(qLower) ||
    qLower === 'hi' || qLower === 'hello' || qLower === 'hey' || qLower === 'namaste'
  ) {
    return {
      text: isTelugu
        ? `నమస్కారం! నేను స్ప్రౌట్ (Sprout). ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?`
        : `Hello! I'm Sprout. How can I help you today?`,
      sources: [],
      actions: []
    };
  }

  if (
    qLower.includes('who are you') ||
    qLower.includes('what is your name') ||
    qLower.includes('whats your name') ||
    qLower === 'who r u'
  ) {
    return {
      text: isTelugu
        ? `నేను **స్ప్రౌట్ (Sprout)**, ఫామ్‌డైరెక్ట్ 2.0 అధికారిక AI సహాయకుడిని.`
        : `I am **Sprout**, your AI assistant for FarmDirect 2.0.`,
      sources: [],
      actions: []
    };
  }

  if (
    qLower.includes('what can you do') ||
    qLower.includes('how can you help') ||
    qLower === 'help' ||
    qLower === 'help me'
  ) {
    return {
      text: isTelugu
        ? `నేను మీకు తాజా కూరగాయల ధరలు, ఆర్డర్ విధానం, రైతు చెల్లింపులు, RWBCIS పంట బీమా మరియు డెలివరీ వివరాల గురించి సమాధానం ఇవ్వగలను.`
        : `I can help you check fresh produce prices, order vegetables, explain how farmers get paid, look up RWBCIS crop insurance, and answer any questions about FarmDirect 2.0!`,
      sources: [],
      actions: []
    };
  }

  if (
    qLower.includes('thank you') ||
    qLower.includes('thanks') ||
    qLower === 'thx' ||
    qLower === 'ty'
  ) {
    return {
      text: isTelugu
        ? `స్వాగతం! మీకు ఇంకా ఏదైనా సహాయం కావాలంటే నన్ను అడగండి.`
        : `You're welcome! Let me know if you need anything else.`,
      sources: [],
      actions: []
    };
  }

  if (
    qLower.includes('joke') ||
    qLower.includes('make me laugh')
  ) {
    return {
      text: `Why did the tomato blush? Because it saw the salad dressing! 😄`,
      sources: [],
      actions: []
    };
  }

  // 2. SPECIFIC TOPICS (Pure text descriptions by default)

  // How to buy / Order
  if (qLower.includes('how do i buy') || qLower.includes('how to buy') || qLower.includes('how to order') || qLower.includes('how can i buy')) {
    return {
      text: isTelugu
        ? `**తాజా కూరగాయలు ఆర్డర్ చేసే విధానం:**\n1. కస్టమర్ మార్కెట్‌లో తాజా కూరగాయలను ఎంచుకోండి.\n2. రాత్రి 9:00 గంటలలోపు ఆర్డర్ చేయండి.\n3. ఉదయం 5:00 గంటలకు కోసిన పంట ఉదయం 7:15 కల్లా మీ ఇంటికి లేదా సమీప కిరాణా హబ్‌కు చేరుతుంది.`
        : `**How to order on FarmDirect:**\n1. Browse available vegetables in the Fresh Market.\n2. Add items to your cart and place your order by 9:00 PM.\n3. Produce is harvested fresh at 5:00 AM dawn and delivered cold to your home or neighborhood Kirana hub by 7:15 AM.`,
      sources: [],
      actions: []
    };
  }

  // Farmers selling & payouts
  if (qLower.includes('farmer') && (qLower.includes('sell') || qLower.includes('pay') || qLower.includes('earn') || qLower.includes('money') || qLower.includes('upi') || qLower.includes('portal') || qLower.includes('harvest'))) {
    return {
      text: isTelugu
        ? `రైతులు బ్లైండ్ యీల్డ్ (వాయిస్ లేదా టెక్స్ట్) ద్వారా పంట బరువు మరియు కనీస ధర నమోదు చేస్తారు. రీఫర్ వ్యాన్లు తోట వద్దే క్రేట్లను సేకరిస్తాయి. వేబ్రిడ్జిపై స్కాన్ చేసిన 6-8 సెకన్లలో ఎస్క్రో నిధులు 100% నేరుగా రైతు UPI ఖాతాలో జమ అవుతాయి.`
        : `Farmers log their harvest via Blind Yield entry (Telugu or English voice supported). Reefer vans collect standardized QR crates at the farmgate, and payments are credited via UPI within 6-8 seconds upon digital weighbridge verification with zero middleman deductions.`,
      sources: [],
      actions: []
    };
  }

  // Delivery & Locations / Reefer Tracking
  if (qLower.includes('delivery') || qLower.includes('deliver') || qLower.includes('location') || qLower.includes('where do you deliver') || qLower.includes('track') || qLower.includes('reefer') || qLower.includes('van')) {
    return {
      text: isTelugu
        ? `మేము అనకాపల్లి, పెందుర్తి, MVP కాలనీ, సీతమ్మధార, సిరిపురం, గాజువాక మరియు మధురవాడ అంతటా 8-12°C రిఫ్రిజిరేటెడ్ వ్యాన్లలో రోజూ ఉదయం 7:15 కల్లా డెలివరీ చేస్తాము.`
        : `We deliver daily across the Visakhapatnam corridor — including Anakapalli, Pendurthi, MVP Colony, Seethammadhara, Siripuram, Gajuwaka, and Madhurawada — in temperature-controlled reefer vans (8-12°C) by 7:15 AM.`,
      sources: [],
      actions: []
    };
  }

  // Price collar
  if (qLower.includes('price collar') || qLower.includes('collar') || qLower.includes('p_settle') || qLower.includes('15%')) {
    return {
      text: isTelugu
        ? `±15% ప్రైస్ కాలర్ సూత్రం ($P_{settle} = \\max(0.85 \\cdot P_0, \\min(1.15 \\cdot P_0, P_{mandi}))$): మండీలలో ధరలు కుప్పకూలినా రైతులకు 85% కనీస ధర లభిస్తుంది, మార్కెట్ ధరలు పెరిగినా కొనుగోలుదారులకు 115% సీలింగ్ వర్తిస్తుంది.`
        : `The ±15% Algorithmic Price Collar ($P_{settle} = \\max(0.85 \\cdot P_0, \\min(1.15 \\cdot P_0, P_{mandi})$) ensures fair pricing. If mandi prices crash, farmers are protected by the 85% floor; if open-market prices spike, buyers are capped at 115%.`,
      sources: [],
      actions: []
    };
  }

  // RWBCIS Insurance
  if (qLower.includes('rwbcis') || qLower.includes('insurance') || qLower.includes('bima') || qLower.includes('crop insurance')) {
    return {
      text: isTelugu
        ? `RWBCIS అనేది కూరగాయల పంటల వాతావరణ బీమా. రైతు వాటా కేవలం 1.5% (ఎకరానికి ₹330). కరవు లేదా భారీ వర్షాలు వచ్చినప్పుడు ఆటోమేటిక్ వెదర్ స్టేషన్ల ద్వారా నష్టపరిహారం నేరుగా రైతు బ్యాంక్ ఖాతాలో DBT ద్వారా జమ అవుతుంది.`
        : `RWBCIS is an automated weather-based crop insurance where farmers pay only 1.5% premium (₹330/acre). IoT Automatic Weather Stations in Kasimkota and Anandapuram trigger direct DBT payouts during rainfall deficits, heatwaves, or cyclones without manual loss surveys.`,
      sources: [],
      actions: []
    };
  }

  // Kirana hub & Dual-OTP
  if (qLower.includes('kirana') || qLower.includes('dual otp') || qLower.includes('pickup') || qLower.includes('hub')) {
    return {
      text: isTelugu
        ? `కిరాణా హబ్‌లు నివాస ప్రాంతాలలో 800 మీటర్ల దూరంలో ఉండే పికప్ కేంద్రాలు. కస్టమర్ 4-అంకెల Dual-OTP కోడ్ (ఉదా: FD-4821) చూపించి తన క్రేట్‌ను సురక్షితంగా తీసుకోవచ్చు.`
        : `Kirana hubs turn local grocery stores into neighborhood pickup depots within an 800m walk. You collect your fresh crate by verifying a 4-digit Dual-OTP code (e.g. FD-4821) with the merchant.`,
      sources: [],
      actions: []
    };
  }

  // Bulk Orders / Institutional Procurement
  if (qLower.includes('bulk') || qLower.includes('wholesale') || qLower.includes('institutional') || qLower.includes('50kg') || qLower.includes('hotel') || qLower.includes('canteen')) {
    return {
      text: isTelugu
        ? `హోటళ్ళు, హాస్టళ్ళు మరియు క్యాంటీన్ల కోసం 50 కిలోల కంటే ఎక్కువ బల్క్ ఆర్డర్లు మరియు ఫార్వర్డ్ కాంట్రాక్టులు అందుబాటులో ఉన్నాయి.`
        : `FarmDirect 2.0 provides forward contracts and tier discounts for bulk institutional buyers (50kg+ daily orders for hotels, hospitals, and canteens) with scheduled refrigerated drop-offs.`,
      sources: [],
      actions: []
    };
  }

  // Sign In / Login / Register / Account
  if (qLower.includes('login') || qLower.includes('sign in') || qLower.includes('signin') || qLower.includes('register') || qLower.includes('signup') || qLower.includes('account')) {
    return {
      text: isTelugu
        ? `మీరు మీ ఫోన్ నంబర్ లేదా ఈమెయిల్ తో లాగిన్ అవ్వవచ్చు లేదా కొత్త ఖాతా నమోదు చేసుకోవచ్చు.`
        : `You can sign in to your FarmDirect 2.0 account or create a new one to access customer orders, farmer payouts, or Kirana hub management.`,
      sources: [],
      actions: []
    };
  }

  // Pesticide / Organic / Lab test
  if (qLower.includes('organic') || qLower.includes('pesticide') || qLower.includes('chemical') || qLower.includes('lab test')) {
    return {
      text: isTelugu
        ? `అవును! ఫామ్‌డైరెక్ట్ లో లభించే అన్ని కూరగాయలు ల్యాబ్ టెస్ట్ చేయబడి 0.00% రసాయన అవశేషాల (Level 0) ధృవీకరణ పొందినవి. కృత్రిమ మగ్గింపు మందులు వాడము.`
        : `All produce on FarmDirect 2.0 is certified with 0.00% synthetic chemical residues (Level 0 NABL lab tested) and harvested naturally at dawn with zero artificial ripening agents.`,
      sources: [],
      actions: []
    };
  }

  // What is FarmDirect
  if (qLower.includes('what is farmdirect') || qLower.includes('about farmdirect') || qLower.includes('what is this platform')) {
    return {
      text: isTelugu
        ? `ఫామ్‌డైరెక్ట్ 2.0 అనేది విశాఖపట్నం ప్రాంతంలో రైతులను నేరుగా గృహాలు మరియు వ్యాపారులతో అనుసంధానించే డిజిటల్ వేదిక. ఇది 12-18% మండీ దళారులను తొలగించి, శీతల రవాణా మరియు తక్షణ UPI చెల్లింపులను అందిస్తుంది.`
        : `FarmDirect 2.0 connects verified local farmers directly with households, Kirana stores, and bulk buyers across the Visakhapatnam corridor, eliminating 12-18% mandi middlemen fees with cold-chain logistics and instant UPI payments.`,
      sources: [],
      actions: []
    };
  }

  // If matching knowledge chunks exist, extract a concise summary of the primary chunk
  if (retrievedChunks && retrievedChunks.length > 0) {
    const primary = retrievedChunks[0];
    const text = primary.summary || primary.content.split('\n\n')[0] || primary.title;
    return {
      text: `**${primary.title}**\n\n${text}`,
      sources: [],
      actions: []
    };
  }

  // 3. GENERAL KNOWLEDGE / DEFAULT (If unrelated, formal error message; otherwise direct platform guidance)
  if (intentType === 'UNRELATED' || !isQueryDomainRelated(q)) {
    return {
      text: isTelugu ? FORMAL_UNRELATED_ERROR_TE : FORMAL_UNRELATED_ERROR_EN,
      sources: [],
      actions: []
    };
  }

  return {
    text: `Regarding **"${q}"**: I'm here to help you with anything related to fresh farm produce, pricing, farmer operations, crop insurance, and orders on FarmDirect 2.0.\n\nExplore Features:\n• [Open Fresh Market](#customer)\n• [Farmer Harvest Portal](#farmer)\n• [RWBCIS Crop Insurance Scheme](#rwbcis)\n• [Live Order Tracking](#tracking)`,
    sources: [],
    actions: []
  };
}

/**
 * Main RAG & Intelligence Assistant Processor
 */
export async function queryRAGAssistant(query, userRole = null, isTelugu = false, options = {}) {
  const startTime = Date.now();
  const currentUser = options.currentUser || null;

  // 1. STRICT PRIVACY & INJECTION FIREWALL (Pre-retrieval security gate)
  const securityCheck = validateQuerySecurity(query, currentUser);
  if (!securityCheck.isPermitted) {
    recordQueryTelemetry({
      query,
      rewrittenQuery: query,
      intent: { type: 'SECURITY_BLOCKED' },
      retrievedDocIds: [],
      relevanceScore: 0,
      latencyMs: Date.now() - startTime,
      engine: 'Privacy-Firewall',
      isSuccessful: false
    });

    return {
      text: securityCheck.refusalMessage || EXACT_SECURITY_REFUSAL,
      sources: [],
      actions: [],
      engine: 'Privacy-Firewall'
    };
  }

  // 2. 3-TIER MEMORY & CONTEXTUAL QUERY REWRITING
  const memory = getMemoryManager(currentUser?.id, userRole);
  const rewrittenQuery = rewriteContextualQuery(query, memory.sessionContext);
  const intent = classifyIntent(rewrittenQuery, memory.sessionContext);

  // Add user turn to conversation history
  memory.addTurn('user', query, { intent: intent.type });

  // 3. GREETING HANDLER (Immediate clean text, zero links unless requested)
  const isTeluguQuery = isTelugu || /[\u0C00-\u0C7F]/.test(query);
  if (intent.type === 'GREETING') {
    const greetingText = isTeluguQuery
      ? `నమస్కారం! నేను స్ప్రౌట్ (Sprout). ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?`
      : `Hello! I'm Sprout. How can I help you today?`;

    memory.addTurn('assistant', greetingText);
    recordQueryTelemetry({
      query,
      rewrittenQuery,
      intent,
      retrievedDocIds: [],
      relevanceScore: 1.0,
      latencyMs: Date.now() - startTime,
      engine: 'Sprout-Greeting',
      isSuccessful: true
    });

    return {
      text: greetingText,
      sources: [],
      actions: [],
      engine: 'Sprout-Greeting'
    };
  }

  // 4. STRICT DOMAIN SCOPE GUARD: UNRELATED QUERY DETECTION (Pure text formal error)
  if (intent.type === 'UNRELATED' || !isQueryDomainRelated(rewrittenQuery, memory.sessionContext)) {
    const formalText = isTeluguQuery ? FORMAL_UNRELATED_ERROR_TE : FORMAL_UNRELATED_ERROR_EN;
    memory.addTurn('assistant', formalText);

    recordQueryTelemetry({
      query,
      rewrittenQuery,
      intent: { type: 'UNRELATED' },
      retrievedDocIds: [],
      relevanceScore: 0,
      latencyMs: Date.now() - startTime,
      engine: 'Formal-Scope-Guard',
      isSuccessful: true
    });

    return {
      text: formalText,
      sources: [],
      actions: [],
      engine: 'Formal-Scope-Guard'
    };
  }

  // 5. INTENT ROUTER: STRUCTURED PRODUCT CATALOG & PRICES (Conceptual synthesis by default)
  if (intent.type === 'PRODUCT_CATALOG' || intent.type === 'PRODUCT_COMPARISON' || intent.type === 'PRODUCT_DETAIL') {
    memory.sessionContext.activeTopic = 'products';
    const isExplicitTable = /table|tabular|raw dump|raw list|spreadsheet|markdown table/i.test(query);

    // A. Product Comparison / Cheapest
    if (intent.type === 'PRODUCT_COMPARISON') {
      const toolRes = await AI_TOOLS.get_cheapest_products.execute({ query, limit: 4, explicitTable: isExplicitTable });
      const actions = [{ label: 'Browse Full Market', hash: '#customer', view: 'customer' }];
      const linkedText = ensureFeatureLink(toolRes.formattedMarkdown, query, [{ category: 'products', action: actions[0] }]);
      memory.addTurn('assistant', linkedText, { activeTopic: 'products' });

      recordQueryTelemetry({
        query,
        rewrittenQuery,
        intent,
        retrievedDocIds: ['products-cheapest'],
        relevanceScore: 1.0,
        latencyMs: Date.now() - startTime,
        engine: 'Theoretical-Advisor'
      });

      return {
        text: linkedText,
        sources: [{ title: 'Live Regional Harvest Inventory', category: 'products' }],
        actions: userAskedForLink(query) ? actions : [],
        engine: 'Theoretical-Advisor'
      };
    }

    // B. Specific Product Detail
    if (intent.type === 'PRODUCT_DETAIL') {
      const toolRes = await AI_TOOLS.search_product.execute({ query: rewrittenQuery, explicitTable: isExplicitTable });
      if (toolRes.success) {
        const matched = toolRes.matches[0];
        memory.sessionContext.activeProduct = matched.name;
        const actions = [{ label: 'Buy in Market', hash: '#customer', view: 'customer' }];
        const linkedText = ensureFeatureLink(toolRes.formattedMarkdown, query, [{ category: 'products', action: actions[0] }]);
        memory.addTurn('assistant', linkedText, { activeProduct: matched.name });

        recordQueryTelemetry({
          query,
          rewrittenQuery,
          intent,
          retrievedDocIds: [matched.id],
          relevanceScore: 0.98,
          latencyMs: Date.now() - startTime,
          engine: 'Theoretical-Advisor'
        });

        return {
          text: linkedText,
          sources: [{ title: `Product: ${matched.name}`, category: 'products' }],
          actions: userAskedForLink(query) ? actions : [],
          engine: 'Theoretical-Advisor'
        };
      }
    }

    // C. Full Catalog Listing ("List the products", "What products do you have?")
    const catalogRes = await AI_TOOLS.list_products.execute({ query, explicitTable: isExplicitTable });
    const actions = [
      { label: 'Open Fresh Market', hash: '#customer', view: 'customer' },
      { label: 'Bulk 50kg+ Desk', hash: '#bulk', view: 'customer' }
    ];
    const linkedText = ensureFeatureLink(catalogRes.formattedMarkdown, query, [{ category: 'products', action: actions[0] }]);
    memory.addTurn('assistant', linkedText, { activeTopic: 'products' });

    recordQueryTelemetry({
      query,
      rewrittenQuery,
      intent,
      retrievedDocIds: ['catalog-full'],
      relevanceScore: 1.0,
      latencyMs: Date.now() - startTime,
      engine: 'Theoretical-Advisor'
    });

    return {
      text: linkedText,
      sources: [{ title: 'FarmDirect 2.0 Fresh Produce Catalog', category: 'products' }],
      actions: userAskedForLink(query) ? actions : [],
      engine: 'Theoretical-Advisor'
    };
  }

  // 6. INTENT ROUTER: AUTHENTICATED USER ORDER TRACKING
  if (intent.type === 'ORDER_TRACKING') {
    memory.sessionContext.activeTopic = 'tracking';
    const orderIdMatch = rewrittenQuery.match(/([a-z0-9_-]+ord[a-z0-9_-]*|\bord-\d+\b|\bfd-ord-\d+\b)/i);
    const extractedOrderId = orderIdMatch ? orderIdMatch[0].toUpperCase() : null;
    const trackingRes = await AI_TOOLS.track_user_order.execute({ orderId: extractedOrderId, currentUser });

    if (!trackingRes.success) {
      const wantsLink = userAskedForLink(query);
      const linkedText = wantsLink
        ? `${trackingRes.message}\n\n[Sign In to Track](#login) • [Live Order Tracking](#tracking)`
        : trackingRes.message;
      return {
        text: linkedText,
        sources: [],
        actions: wantsLink ? [{ label: 'Sign In to Track', hash: '#login', view: 'home' }] : [],
        engine: 'Privacy-Firewall'
      };
    }

    const actions = [{ label: 'Open Tracking Dashboard', hash: '#tracking', view: 'customer' }];
    const linkedText = ensureFeatureLink(trackingRes.formattedMarkdown, query, [{ category: 'logistics', action: actions[0] }]);
    memory.addTurn('assistant', linkedText, { activeTopic: 'tracking' });

    return {
      text: linkedText,
      sources: [{ title: '3PL Cold-Chain Telemetry Feed', category: 'logistics' }],
      actions: userAskedForLink(query) ? actions : [],
      engine: 'Live-Order-Tracker'
    };
  }

  // 5. INTENT ROUTER: GENERAL KNOWLEDGE (Agriculture & Farming scope only)
  if (intent.type === 'GENERAL_KNOWLEDGE') {
    if (!isQueryDomainRelated(rewrittenQuery, memory.sessionContext)) {
      const formalText = isTeluguQuery ? FORMAL_UNRELATED_ERROR_TE : FORMAL_UNRELATED_ERROR_EN;
      memory.addTurn('assistant', formalText);
      return {
        text: formalText,
        sources: [],
        actions: [
          { label: 'Open Fresh Market', hash: '#customer', view: 'customer' },
          { label: 'Farmer Harvest Portal', hash: '#farmer', view: 'farmer' }
        ],
        engine: 'Formal-Scope-Guard'
      };
    }

    const generalSystemPrompt = `You are "Sprout", the official AI assistant for FarmDirect 2.0.

OPERATING GUIDELINES:
1. Provide helpful, concise, and direct answers according to the user's prompt.
2. Ground your explanations strictly in agriculture, fresh produce, and FarmDirect 2.0 principles.
3. If the query is unrelated to agriculture or FarmDirect, you must decline with:
"${FORMAL_UNRELATED_ERROR_EN}"
4. Feature links: include clean markdown links:
   - Fresh Market: [Open Fresh Market](#customer)
   - Farmer Portal: [Farmer Harvest Portal](#farmer)
   - RWBCIS: [RWBCIS Crop Insurance Scheme](#rwbcis)
   - Tracking: [Live Order Tracking](#tracking)
5. Language: ${isTeluguQuery ? 'Respond in natural Telugu language.' : 'Respond in English.'}`;

    try {
      const geminiRes = await generateGeminiResponse({
        prompt: rewrittenQuery,
        messages: memory.getOllamaMessages(4),
        systemPrompt: generalSystemPrompt
      });

      if (geminiRes && geminiRes.text) {
        const linkedText = ensureFeatureLink(geminiRes.text, rewrittenQuery, []);
        memory.addTurn('assistant', linkedText);
        recordQueryTelemetry({
          query,
          rewrittenQuery,
          intent,
          retrievedDocIds: [],
          relevanceScore: 0.90,
          latencyMs: Date.now() - startTime,
          engine: `Gemini (${geminiRes.model})`
        });

        return {
          text: linkedText,
          sources: [{ title: 'Gemini Knowledge Base', category: 'general' }],
          actions: [],
          engine: `Gemini (${geminiRes.model})`
        };
      }
    } catch (e) {
      console.warn('Gemini general knowledge query fallback:', e);
    }

    // Local conceptual fallback
    const localKnowledgeResult = synthesizeLocalRAGResponse(rewrittenQuery, [], userRole, isTeluguQuery, intent);
    const linkedLocalText = ensureFeatureLink(localKnowledgeResult.text, rewrittenQuery, []);
    memory.addTurn('assistant', linkedLocalText);
    return {
      ...localKnowledgeResult,
      text: linkedLocalText,
      engine: 'Sprout-Knowledge-Engine'
    };
  }

  // 6. INTENT ROUTER: PLATFORM KNOWLEDGE VIA HYBRID DENSE + BM25 RRF RAG
  const retrievedChunks = hybridRetrieveChunks(rewrittenQuery, { userRole, topK: 3 });

  // Update session context with matched domain
  if (retrievedChunks.length > 0) {
    const cat = retrievedChunks[0].category;
    if (cat === 'schemes') memory.sessionContext.activeTopic = 'insurance';
    if (cat === 'pricing') memory.sessionContext.activeTopic = 'price-collar';
    if (cat === 'logistics') memory.sessionContext.activeTopic = 'tracking';
  }

  const contextText = retrievedChunks.length > 0
    ? sanitizeContextForPrompt(retrievedChunks.map((c, i) => `[Source ${i + 1}: ${c.title}]\n${c.content}`).join('\n\n'))
    : `General agricultural supply chain platform connecting farmers directly to retail customers and institutional buyers across the Anakapalli–Pendurthi–Visakhapatnam corridor. Features: RWBCIS 1.5% farmer share weather insurance, ±15% Price Collar formula (P_settle = max(0.85*P0, min(1.15*P0, P_mandi))), live IoT Reefer cold chain (8-12°C), Kirana Hub Dual-OTP pickup (FD-4821), and instant UPI payouts within 6-8 seconds.`;

  const actionList = [];
  const actionSet = new Set();
  for (const chunk of retrievedChunks) {
    if (chunk.action && !actionSet.has(chunk.action.label)) {
      actionSet.add(chunk.action.label);
      actionList.push(chunk.action);
    }
  }

  if (actionList.length === 0) {
    actionList.push(
      { label: 'RWBCIS Crop Insurance', hash: '#rwbcis', view: 'farmer' },
      { label: 'Live Reefer Tracking', hash: '#tracking', view: 'customer' },
      { label: '±15% Price Collar Formula', hash: '#farmer', view: 'farmer' }
    );
  }

  const systemPrompt = `You are "Sprout", the official AI assistant for FarmDirect 2.0.

OPERATING GUIDELINES:
1. CONCISE & PROMPT-ACCURATE: Answer directly according to the user's prompt without unnecessary essays or boilerplate text.
2. STRICT DOMAIN SCOPE: You are exclusively the assistant for FarmDirect 2.0, fresh agricultural produce, farmer operations, mandi pricing, cold-chain delivery, and platform features. If the user asks ANY question unrelated to this scope (e.g. general programming, movies, celebrity trivia, politics, sports, non-agricultural science), you MUST decline and output ONLY the formal error message:
"${FORMAL_UNRELATED_ERROR_EN}"
3. STRICT LINKS POLICY: Provide feature links or buttons ONLY when the user explicitly asks for a link, URL, portal, page, or navigation. If the user does not ask for a link, provide ONLY a clear text answer without any links or markdown brackets.
   - When asked for links:
     - Customer market / Buy produce: [Open Fresh Market](#customer)
     - Farmer portal / Sell / UPI: [Farmer Harvest Portal](#farmer)
     - RWBCIS Weather Crop Insurance: [RWBCIS Crop Insurance Scheme](#rwbcis)
     - Reefer tracking / Delivery: [Live Order Tracking](#tracking)
     - Kirana hubs: [Kirana Hub Portal](#kirana)
     - Bulk procurement: [Bulk Procurement Desk](#bulk)
     - Sign in / Register: [Sign In / Register](#login)
4. TONE: Professional, formal, clear, and helpful.
5. RAG GROUNDING: Ground answers in the verified FarmDirect knowledge base provided below.
6. LANGUAGE: ${isTeluguQuery ? 'Respond in natural Telugu with clear formatting.' : 'Respond in English with clear formatting.'}

Verified Knowledge Context:
${contextText}`;

  // Execute Gemini Generation with Multi-Turn History
  try {
    const geminiResult = await generateGeminiResponse({
      prompt: rewrittenQuery,
      messages: memory.getOllamaMessages(6),
      systemPrompt: systemPrompt
    });

    if (geminiResult && geminiResult.text) {
      const linkedText = ensureFeatureLink(geminiResult.text, rewrittenQuery, retrievedChunks);
      memory.addTurn('assistant', linkedText);

      recordQueryTelemetry({
        query,
        rewrittenQuery,
        intent,
        retrievedDocIds: retrievedChunks.map(c => c.id),
        relevanceScore: retrievedChunks[0]?.fusedScore || 0.9,
        latencyMs: Date.now() - startTime,
        engine: `Gemini (${geminiResult.model})`
      });

      return {
        text: linkedText,
        sources: retrievedChunks.map(c => ({ title: c.title, category: c.category })),
        actions: userAskedForLink(query) ? actionList : [],
        engine: `Gemini (${geminiResult.model})`
      };
    }
  } catch (geminiErr) {
    console.warn('Gemini generation unavailable, using grounded local synthesis:', geminiErr);
  }

  // 7. DETERMINISTIC LOCAL FALLBACK (100% reliable offline/online)
  const localResult = synthesizeLocalRAGResponse(rewrittenQuery, retrievedChunks, userRole, isTelugu, intent);
  const linkedLocalText = ensureFeatureLink(localResult.text, rewrittenQuery, retrievedChunks);
  memory.addTurn('assistant', linkedLocalText);

  recordQueryTelemetry({
    query,
    rewrittenQuery,
    intent,
    retrievedDocIds: retrievedChunks.map(c => c.id),
    relevanceScore: retrievedChunks[0]?.fusedScore || 0.8,
    latencyMs: Date.now() - startTime,
    engine: 'Sprout-Engine'
  });

  return {
    ...localResult,
    text: linkedLocalText,
    actions: userAskedForLink(query) ? (localResult.actions || []) : [],
    engine: 'Sprout-Engine'
  };
}
