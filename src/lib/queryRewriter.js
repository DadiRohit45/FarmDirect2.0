/**
 * FarmDirect 2.0 — Contextual Query Rewriter & Intent Classifier
 * 
 * Capabilities:
 * 1. Intent Detection across 10 specialized domains (catalog, prices, tracking, RWBCIS, collar, general AI)
 * 2. Reference & Pronoun Resolution ("it", "their", "that", "the first one" -> named entity)
 * 3. Misspelling & Multilingual Phonetic Normalization (Telugu + English)
 * 4. Multi-part query decomposition
 */

// Common phonetic and spelling normalization dictionary
const SPELLING_CORRECTIONS = {
  'tomatos': 'tomatoes',
  'tomtos': 'tomatoes',
  'tomto': 'tomato',
  'tamata': 'tomato',
  'tamatar': 'tomato',
  'thomata': 'tomato',
  'bhindi': 'bhendi',
  'ladyfinger': 'bhendi',
  'vankaya': 'brinjal',
  'baingan': 'brinjal',
  'eggplant': 'brinjal',
  'mirchi': 'chili',
  'chilly': 'chili',
  'chillies': 'chilies',
  'alu': 'potato',
  'aloo': 'potato',
  'pyaz': 'onion',
  'ullipaya': 'onion',
  'kothimeera': 'coriander',
  'inshurance': 'insurance',
  'insuranc': 'insurance',
  'coller': 'collar',
  'colar': 'collar',
  'reefr': 'reefer',
  'refer': 'reefer',
  'kiran': 'kirana',
  'scrow': 'escrow',
  'sho': 'show',
  'vegies': 'vegetables',
  'veggies': 'vegetables',
  'hv': 'have',
  'wht': 'what',
  'u': 'you',
  'plz': 'please',
  'pls': 'please',
  'hlp': 'help',
  'hlo': 'hello',
  'hai': 'hi',
  'namaskar': 'namaste',
  'namaskaram': 'namaste'
};

/**
 * Normalizes spelling errors and Telugu transliterated synonyms
 */
export function normalizeQuerySpelling(text) {
  if (!text) return '';
  const words = text.split(/\s+/);
  const corrected = words.map(w => {
    const clean = w.toLowerCase().replace(/[^\w]/g, '');
    return SPELLING_CORRECTIONS[clean] || w;
  });
  return corrected.join(' ');
}

// Explicit off-domain patterns (topics completely unrelated to FarmDirect 2.0 or agriculture)
const OFF_DOMAIN_PATTERNS = [
  /\b(president|prime minister|narendra modi|bjp|congress|parliament|election|biden|trump|putin|chief minister|mla|mp)\b/i,
  /\b(actor|actress|bollywood|hollywood|tollywood|movie|cinema|film|netflix|box office|song|lyrics)\b/i,
  /\b(cricket|football|soccer|fifa|ipl|world cup|messi|ronaldo|virat kohli|rohit sharma|dhoni|tennis|badminton)\b/i,
  /\b(python|javascript|typescript|c\+\+|java\b|react code|html code|css code|github|programming|write a code|write code|debug code|sorting algorithm|binary tree|leetcode)\b/i,
  /\b(quantum|black hole|astronomy|galaxy|mars|nasa|isro|relativity|einstein|newton|speed of light|alien|aliens|ufo)\b/i,
  /\b(cryptocurrency|crypto|bitcoin|ethereum|dogecoin|solana|blockchain|nft|web3|stock market|share market|sensex|nifty|nasdaq|forex|dow jones)\b/i,
  /\b(capital of|largest country|longest river|mount everest|population of|world war|french revolution)\b/i,
  /\b(bake a cake|cake recipe|pizza recipe|biryani recipe|cocktail|weight loss|gym workout|horoscope|zodiac|tell me a story|write a story|write a poem)\b/i,
  /\b(elon musk|mark zuckerberg|bill gates|steve jobs|sundar pichai)\b/i
];

/**
 * Checks whether a user query is related to FarmDirect 2.0 or agriculture
 */
export function isQueryDomainRelated(query, sessionContext = {}) {
  if (!query || typeof query !== 'string') return false;
  const q = normalizeQuerySpelling(query).toLowerCase().trim();

  // 1. Greetings, politeness & conversational essentials
  if (
    /^(hi|hello|hey|namaste|namaskaram|vanakkam|good\s+(morning|afternoon|evening|day)|greetings|yo)\b/i.test(q) ||
    /^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|how\s+can\s+you\s+help|help\s*me?|start|menu|howdy)\b/i.test(q) ||
    /^(thank\s+you|thanks|thx|ty|bye|goodbye|ok|okay)\b/i.test(q) ||
    /^(how\s+are\s+you|how\s+do\s+you\s+do|how\s+is\s+it\s+going|what['’]?s\s+up)\b/i.test(q) ||
    q === 'hi' || q === 'hello' || q === 'hey' || q === 'help' || q === 'menu'
  ) {
    return true;
  }

  // 2. Off-domain pattern exclusion
  for (const pattern of OFF_DOMAIN_PATTERNS) {
    if (pattern.test(q)) {
      // Allow only if genuine crop/insurance/farm keyword is also present
      if (q.includes('insurance') || q.includes('rwbcis') || q.includes('crop') || q.includes('farmer') || q.includes('vegetable')) {
        // Exception allowed
      } else {
        return false;
      }
    }
  }

  // 3. Active session context follow-up continuation
  if (
    (sessionContext.activeProduct || sessionContext.activeTopic || sessionContext.activeScheme) &&
    /^(what\s+about\s+(it|its|their|the\s+price)|how\s+much(\s+is\s+it)?|is\s+it\s+available|tell\s+me\s+more|explain\s+further|more\s+details|who\s+is\s+the\s+farmer|where\s+is\s+it\s+from)/i.test(q)
  ) {
    return true;
  }

  // 4. Positive Domain Terms match
  const DOMAIN_TERMS = [
    // Platform & identity
    'farmdirect', 'farm direct', 'platform', 'sprout', 'kisan mitra', 'website',
    'about farmdirect', 'about this', 'project abstract', 'architecture', 'developer',
    'creator', 'author', 'contact us', 'support team', 'login', 'signin', 'signup', 'register', 'account',
    'profile', 'password', 'admin', 'logout', 'auth',

    // Crops & vegetables (English, Telugu, transliteration)
    'vegetable', 'vegetables', 'veggie', 'veggies', 'produce', 'crop', 'crops', 'harvest',
    'tomato', 'tomatoes', 'tamata', 'tamatar', 'onion', 'onions', 'ullipaya', 'pyaz',
    'potato', 'potatoes', 'aloo', 'alu', 'brinjal', 'eggplant', 'vankaya', 'baingan',
    'bhendi', 'bhindi', 'okra', 'ladyfinger', 'palak', 'spinach', 'chili', 'chilies',
    'chillies', 'mirchi', 'coriander', 'kothimeera', 'carrot', 'carrots', 'cabbage',
    'cauliflower', 'beans', 'ginger', 'allam', 'garlic', 'vellulli', 'greens', 'fruit', 'fruits',
    'రైతు', 'కూరగాయలు', 'ధర', 'మార్కెట్', 'బీమా', 'ట్రాకింగ్', 'ఆర్డర్', 'కిరాణా',

    // Quality & safety
    'organic', 'pesticide', 'chemical', 'residue', 'lab report', 'lab test', 'nabl',
    '0.00%', 'level 0', 'fresh', 'freshness', 'sunrise', 'dawn', 'natural', 'quality',
    'shelf life', 'crate', 'crates', 'kg', 'kilo', 'gram',

    // Commerce & Orders
    'buy', 'buyer', 'buying', 'order', 'orders', 'ordering', 'cart', 'checkout', 'purchase',
    'market', 'store', 'shop', 'catalog', 'stock', 'inventory', 'available', 'availability',
    'price', 'prices', 'pricing', 'cost', 'rate', 'rates', 'discount', 'cheapest', 'cheap',
    'basket', 'subscription', 'customer', 'consumer',

    // Farmers & payouts
    'farmer', 'farmers', 'kisan', 'rythu', 'rhythu', 'sell', 'selling', 'yield', 'blind yield',
    'weighbridge', 'weighing', 'scale', 'e-crop', 'ecrop', 'middleman', 'middlemen', 'mandi',
    'apmc', 'anandapuram', 'anakapalli', 'upi', 'payout', 'escrow', 'settlement', 'p_settle',

    // Insurance & schemes
    'rwbcis', 'insurance', 'bima', 'premium', '1.5%', 'weather sensor', 'weather station',
    'aws', 'parametric', 'dbt', 'subsidy', 'deficit', 'kasimkota', 'drought', 'cyclone', 'flood',

    // Price collar
    'price collar', 'collar', '±15%', '15%', 'floor', 'ceiling', 'risk pool', 'volatility',

    // Logistics & cold-chain
    'reefer', 'cold chain', 'cold-chain', 'van', 'vans', 'truck', 'transit', 'delivery',
    'deliver', 'deliveries', 'shipping', 'porter', 'driver', 'temperature', '8-12', '8-12°c',
    'iot', 'telemetry', 'tracking', 'track', 'visakhapatnam', 'vizag', 'pendurthi',
    'mvp colony', 'seethammadhara', 'gajuwaka', 'madhurawada', 'corridor',

    // Kirana hubs
    'kirana', 'micro depot', 'depot', 'dual otp', 'dual-otp', 'otp', 'pickup', 'fd-4821',

    // Bulk procurement
    'bulk', 'wholesale', 'institutional', '50kg', 'hotel', 'hostel', 'canteen', 'forward contract',

    // Agronomy
    'farming', 'cultivation', 'pest', 'pests', 'disease', 'fertilizer', 'fertilizers',
    'manure', 'jeevamrutha', 'soil', 'irrigation', 'neem', 'vermicompost', 'sowing', 'seed'
  ];

  return DOMAIN_TERMS.some(term => q.includes(term));
}

/**
 * Classifies query intent across specialized domains or UNRELATED
 */
export function classifyIntent(query, sessionContext = {}) {
  const q = normalizeQuerySpelling(query).toLowerCase().trim();

  // 1. Greetings & Conversational Pleasantries
  if (
    /^(hi|hello|hey|namaste|namaskaram|vanakkam|good\s+(morning|afternoon|evening|day)|greetings|yo)\b/i.test(q) ||
    /^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+can\s+you\s+do|help\s*me?|start|menu|howdy)\b/i.test(q) ||
    /^(thank\s+you|thanks|thx|ty|bye|goodbye|ok|okay)\b/i.test(q) ||
    /^(how\s+are\s+you|how\s+do\s+you\s+do|how\s+is\s+it\s+going|what['’]?s\s+up)\b/i.test(q) ||
    q === 'hi' || q === 'hello' || q === 'hey' || q === 'help' || q === 'kisan mitra'
  ) {
    return { type: 'GREETING', confidence: 0.98 };
  }

  // Pre-filter: If explicitly off-domain or unrelated, mark immediately
  if (!isQueryDomainRelated(query, sessionContext)) {
    return { type: 'UNRELATED', confidence: 0.99 };
  }

  // 2. Platform Overview & Mission
  if (
    q.includes('what is farmdirect') ||
    q.includes('what is this platform') ||
    q.includes('what is this website') ||
    q.includes('what does this app do') ||
    q.includes('how does this work') ||
    q.includes('how does the platform work') ||
    q.includes('about farmdirect') ||
    q.includes('why farmdirect') ||
    q.includes('tell me about this') ||
    q.includes('overview') ||
    q.includes('who built this') ||
    q.includes('who created') ||
    q.includes('project details') ||
    q.includes('features of farmdirect')
  ) {
    return { type: 'PLATFORM_OVERVIEW', confidence: 0.95 };
  }

  // 3. Product Catalog & Listing
  if (
    q.match(/^(list|show|what|browse|display|view)\s+(the\s+|all\s+|me\s+a\s+)?(products|vegetables|crops|produce|items|stock|catalog|table)/i) ||
    q.includes('what products do you have') ||
    q.includes('what do you sell') ||
    q.includes('show everything available') ||
    q.includes('available vegetables') ||
    q.includes('show catalog') ||
    q.includes('table of products') ||
    q.includes('product table') ||
    (q.includes('table') && (q.includes('product') || q.includes('vegetable') || q.includes('crop') || q.includes('produce'))) ||
    q === 'products' ||
    q === 'vegetables'
  ) {
    return { type: 'PRODUCT_CATALOG', confidence: 0.95 };
  }

  // 4. Product Comparison / Price Sorting
  if (
    q.includes('which product is cheapest') ||
    q.includes('which products are cheapest') ||
    q.includes('cheapest vegetable') ||
    q.includes('cheapest produce') ||
    q.includes('cheapest') ||
    q.includes('lowest price') ||
    q.includes('highest discount') ||
    q.includes('compare products')
  ) {
    return { type: 'PRODUCT_COMPARISON', confidence: 0.92 };
  }

  // 5. Specific Product Price & Availability
  const KNOWN_CROPS = ['tomato', 'tomatoes', 'spinach', 'palak', 'okra', 'bhendi', 'brinjal', 'chili', 'chillies', 'chilies', 'onion', 'potato', 'coriander', 'carrot', 'cauliflower', 'cabbage', 'beans', 'ginger', 'garlic'];
  const mentionsKnownCrop = KNOWN_CROPS.some(crop => q.includes(crop));

  if (
    mentionsKnownCrop ||
    q.includes('do you have') ||
    q.includes('is there') ||
    q.includes('price of') ||
    q.includes('how much is') ||
    q.includes('stock of') ||
    q.includes('rate of') ||
    (sessionContext.activeProduct && (q.includes('is it available') || q.includes('what is its price') || q.includes('how much') || q.includes('who is the farmer')))
  ) {
    return { type: 'PRODUCT_DETAIL', confidence: 0.90 };
  }

  // 6. Order Tracking & Reefer Cold Chain
  if (
    q.includes('track') ||
    q.includes('where is my order') ||
    q.includes('order status') ||
    q.includes('reefer temperature') ||
    q.includes('delivery status') ||
    q.includes('cargo temp')
  ) {
    return { type: 'ORDER_TRACKING', confidence: 0.92 };
  }

  // 7. Insurance (RWBCIS)
  if (
    q.includes('rwbcis') ||
    q.includes('insurance') ||
    q.includes('crop insurance') ||
    q.includes('bima') ||
    q.includes('weather trigger') ||
    q.includes('farmer share') ||
    q.includes('parametr')
  ) {
    return { type: 'INSURANCE_RWBCIS', confidence: 0.94 };
  }

  // 8. Price Collar & Mandi Algorithm
  if (
    q.includes('price collar') ||
    q.includes('collar') ||
    q.includes('p_settle') ||
    q.includes('±15%') ||
    q.includes('15%') ||
    q.includes('mandi formula') ||
    q.includes('risk pool') ||
    q.includes('distress sale')
  ) {
    return { type: 'PRICE_COLLAR', confidence: 0.94 };
  }

  // 9. Role Guide: Farmer Operations & Selling
  if (
    q.includes('how do farmers') ||
    q.includes('farmer sell') ||
    q.includes('sell crops') ||
    q.includes('sell produce') ||
    q.includes('how to sell') ||
    q.includes('blind yield') ||
    q.includes('log harvest') ||
    q.includes('e-crop') ||
    q.includes('weighbridge') ||
    q.includes('qr crate') ||
    q.includes('as a farmer') ||
    q.includes('i am a farmer') ||
    q.includes('farmer registration')
  ) {
    return { type: 'ROLE_GUIDE_FARMER', confidence: 0.93 };
  }

  // 10. Role Guide: Customer / Buyer / How to Order
  if (
    q.includes('how do i buy') ||
    q.includes('how to buy') ||
    q.includes('how to order') ||
    q.includes('how can i order') ||
    q.includes('place an order') ||
    q.includes('as a customer') ||
    q.includes('as a buyer') ||
    q.includes('how does buying work') ||
    q.includes('home delivery') ||
    q.includes('minimum order') ||
    q.includes('subscription basket')
  ) {
    return { type: 'ROLE_GUIDE_CUSTOMER', confidence: 0.93 };
  }

  // 11. Role Guide: Kirana Hub Micro-Depots
  if (
    q.includes('kirana') ||
    q.includes('micro depot') ||
    q.includes('dual-otp') ||
    q.includes('dual otp') ||
    q.includes('security buffer') ||
    q.includes('handling commission') ||
    q.includes('store pickup') ||
    q.includes('become a kirana partner')
  ) {
    return { type: 'ROLE_GUIDE_KIRANA', confidence: 0.93 };
  }

  // 12. Role Guide: Bulk Institutional Procurement
  if (
    q.includes('bulk') ||
    q.includes('institutional') ||
    q.includes('hotel') ||
    q.includes('hostel') ||
    q.includes('canteen') ||
    q.includes('50kg') ||
    q.includes('forward contract') ||
    q.includes('anchor') ||
    q.includes('catering')
  ) {
    return { type: 'ROLE_GUIDE_BULK', confidence: 0.93 };
  }

  // 13. Payments, Escrow & UPI
  if (
    q.includes('payment') ||
    q.includes('how to pay') ||
    q.includes('payment method') ||
    q.includes('instant upi') ||
    q.includes('upi') ||
    q.includes('escrow') ||
    q.includes('refund') ||
    q.includes('payout') ||
    q.includes('commission') ||
    q.includes('wallet')
  ) {
    return { type: 'PAYMENT_ESCROW', confidence: 0.91 };
  }

  // 14. Logistics, Cold-Chain & Locations
  if (
    q.includes('delivery') ||
    q.includes('cold chain') ||
    q.includes('reefer') ||
    q.includes('location') ||
    q.includes('where do you deliver') ||
    q.includes('areas') ||
    q.includes('visakhapatnam') ||
    q.includes('vizag') ||
    q.includes('anakapalli') ||
    q.includes('pendurthi') ||
    q.includes('shipping') ||
    q.includes('transport')
  ) {
    return { type: 'LOGISTICS_DELIVERY', confidence: 0.91 };
  }

  // 15. Quality, Pesticide-Free & Organic Assurance
  if (
    q.includes('organic') ||
    q.includes('pesticide') ||
    q.includes('chemical') ||
    q.includes('lab test') ||
    q.includes('freshness') ||
    q.includes('quality') ||
    q.includes('safe to eat') ||
    q.includes('shelf life')
  ) {
    return { type: 'QUALITY_TESTING', confidence: 0.92 };
  }

  // 16. Agricultural Advice & Agronomy (Pest control, soil, seasons)
  if (
    q.includes('pest') ||
    q.includes('disease') ||
    q.includes('fertilizer') ||
    q.includes('manure') ||
    q.includes('jeevamrutha') ||
    q.includes('soil') ||
    q.includes('farming tips') ||
    q.includes('crop season') ||
    q.includes('irrigation') ||
    q.includes('neem') ||
    q.includes('vermicompost')
  ) {
    return { type: 'AGRI_ADVICE', confidence: 0.92 };
  }

  // 17. Unrelated General Knowledge (Outside FarmDirect & Agriculture scope)
  if (
    q.includes('artificial intelligence') ||
    q.includes('what is ai') ||
    q.includes('explain ai') ||
    q.includes('machine learning') ||
    q.includes('deep learning') ||
    q.includes('how does blockchain work') ||
    q.includes('blockchain') ||
    q.includes('what is photosynthesis') ||
    q.includes('photosynthesis') ||
    q.includes('who is the president') ||
    q.includes('prime minister') ||
    q.includes('weather forecast')
  ) {
    return { type: 'UNRELATED', confidence: 0.99 };
  }

  // Default: If domain related, general platform inquiry; otherwise UNRELATED
  if (isQueryDomainRelated(query, sessionContext)) {
    return { type: 'PLATFORM_KNOWLEDGE', confidence: 0.85 };
  }

  return { type: 'UNRELATED', confidence: 0.99 };
}

/**
 * Resolves pronouns and references using conversation context
 * E.g. "What about their pricing?" -> "What is the pricing of the available products?"
 * E.g. "Is it available?" -> "Is Hybrid Vine Tomato (S-12) available?"
 */
export function rewriteContextualQuery(rawQuery, sessionContext = {}) {
  let query = normalizeQuerySpelling(rawQuery).trim();
  const qLower = query.toLowerCase();

  // If query contains pronouns OR is an implicit contextual follow-up
  const hasPronoun = /\b(it|its|that|those|their|the\s+first\s+one|the\s+cheapest\s+one)\b/i.test(qLower);
  const isImplicitProductFollowUp = Boolean(sessionContext.activeProduct && /^(who\s+is\s+the\s+farmer|farmer\s+name|what\s+is\s+(its|the)?\s*price|how\s+much\s+is\s+it|where\s+is\s+it\s+from|farm\s+origin)/i.test(qLower));
  const isImplicitSchemeFollowUp = Boolean((sessionContext.activeTopic === 'insurance' || sessionContext.activeScheme === 'RWBCIS') && /^(what\s+is\s+the\s+farmer\s+share|farmer\s+share|how\s+to\s+apply|weather\s+triggers?)/i.test(qLower));

  if (hasPronoun || isImplicitProductFollowUp || isImplicitSchemeFollowUp) {
    // 1. Resolve product references
    if (sessionContext.activeProduct) {
      const prodName = sessionContext.activeProduct;

      if (qLower.match(/\b(is\s+it\s+available|available|in\s+stock)\b/i)) {
        return `Is ${prodName} currently available in stock?`;
      }
      if (qLower.match(/\b(what\s+about\s+(its|their|the)\s+price|how\s+much\s+is\s+it|what\s+is\s+the\s+price|what\s+is\s+its\s+price|price|cost)\b/i)) {
        return `What is the price of ${prodName}?`;
      }
      if (qLower.match(/\b(who\s+is\s+the\s+farmer|farmer\s+name|where\s+does\s+it\s+come\s+from|farm\s+origin)\b/i)) {
        return `Who is the farmer and farm origin for ${prodName}?`;
      }
      if (qLower.match(/\b(is\s+it\s+covered|crop\s+insurance)\b/i)) {
        return `How does RWBCIS crop insurance apply to ${prodName}?`;
      }

      // General replacement
      query = query.replace(/\b(it|that)\b/gi, prodName);
    }

    // 2. Resolve scheme references (RWBCIS)
    else if (sessionContext.activeTopic === 'insurance' || sessionContext.activeScheme === 'RWBCIS') {
      if (qLower.includes('farmer share') || qLower.includes('premium')) {
        return `What is the farmer's premium share for the RWBCIS crop insurance scheme?`;
      }
      if (qLower.includes('how to apply') || qLower.includes('how does it trigger')) {
        return `How does the RWBCIS parametric weather trigger work?`;
      }
      query = query.replace(/\b(it|that)\b/gi, 'the RWBCIS crop insurance scheme');
    }

    // 3. Resolve price collar references
    else if (sessionContext.activeTopic === 'price-collar') {
      if (qLower.includes('formula') || qLower.includes('math')) {
        return `Explain the mathematical formula for the ±15% Algorithmic Price Collar`;
      }
      query = query.replace(/\b(it|that)\b/gi, 'the ±15% Algorithmic Price Collar');
    }

    // 4. Resolve catalog references ("their", "those")
    else if (sessionContext.activeTopic === 'products') {
      if (qLower.includes('pricing') || qLower.includes('prices')) {
        return `What are the prices of the available products in the catalog?`;
      }
      query = query.replace(/\b(their|those)\b/gi, 'the available products');
    }
  }

  // Handle follow-up "tell me more" or "explain further"
  if (qLower === 'tell me more' || qLower === 'explain further' || qLower === 'more details') {
    if (sessionContext.activeTopic === 'insurance') return `Provide a detailed technical breakdown of the RWBCIS crop insurance scheme`;
    if (sessionContext.activeTopic === 'price-collar') return `Provide a step-by-step mathematical example of the ±15% Price Collar settlement`;
    if (sessionContext.activeTopic === 'products') return `Show a detailed price comparison between FarmDirect fresh produce and APMC mandi rates`;
  }

  return query;
}
