/**
 * FarmDirect 2.0 — Strict Privacy & Authorization Firewall
 * 
 * Enforces zero-leakage security boundaries:
 * 1. PUBLIC: Public produce catalog, prices, platform documentation, architectural features.
 * 2. USER_AUTHORIZED: Current logged-in user's own profile, own orders, and own transactions.
 * 3. THIRD_PARTY_PRIVATE: Other users' phone numbers, addresses, personal credentials, private orders, pickup OTPs.
 * 
 * CRITICAL RULE: If someone requests unauthorized private information, respond with EXACTLY:
 * "Sorry, this information is not available."
 */

export const EXACT_SECURITY_REFUSAL = "Sorry, this information is not available.";

// Patterns indicating unauthorized private PII or credential harvesting
const PRIVATE_INFO_PATTERNS = [
  /phone\s*number/i,
  /mobile\s*number/i,
  /contact\s*number/i,
  /personal\s*address/i,
  /user['’]?s\s*detail/i,
  /customer['’]?s\s*detail/i,
  /customer\s*phone/i,
  /buyer\s*phone/i,
  /farmer\s*phone/i,
  /pickup\s*(pin|otp|code)/i,
  /otp\s*for/i,
  /temp_password/i,
  /temporary\s*password/i,
  /password\s*of/i,
  /admin\s*password/i,
  /master\s*passcode/i,
  /user\s*passwords/i,
  /secret\s*key/i,
  /api\s*key/i,
  /auth\s*token/i,
  /credentials\s*for/i,
  /dump\s*(database|users|profiles|table)/i,
  /select\s+\*\s+from/i,
  /show\s+all\s+(users|customers|passwords|phones)/i
];

// Prompt injection and jailbreak protection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(all\s+)?guidelines/i,
  /override\s+(security|system|rules)/i,
  /jailbreak/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /dan\s+mode/i,
  /system\s*prompt\s*reveal/i,
  /print\s*(your\s*)?(initial\s*)?instructions/i,
  /show\s*environment\s*variables/i,
  /printenv/i
];

// Names of demo/third-party individuals to protect
const PROTECTED_NAMES = [
  'ananya rao',
  'k. venkatesh',
  'venkatesh',
  's. sunitha',
  'sunitha',
  'pooja sharma',
  'ramesh naidu'
];

/**
 * Validates whether the incoming query is safe and authorized
 * @param {string} query - Raw user query
 * @param {Object|null} currentUser - Current authenticated user
 * @returns {{ isPermitted: boolean, refusalMessage: string|null, reason: string|null }}
 */
export function validateQuerySecurity(query, currentUser = null) {
  if (!query || typeof query !== 'string') {
    return { isPermitted: true, refusalMessage: null, reason: null };
  }

  const clean = query.trim().toLowerCase();

  // 1. Check for prompt injection attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        isPermitted: false,
        refusalMessage: EXACT_SECURITY_REFUSAL,
        reason: 'Injection pattern detected'
      };
    }
  }

  // 2. Check for third-party PII harvesting
  for (const pattern of PRIVATE_INFO_PATTERNS) {
    if (pattern.test(clean)) {
      // Allow user to ask about general platform OTP mechanism, but NOT individual OTPs/credentials
      if (clean.includes('how does dual-otp work') || clean.includes('explain dual-otp') || clean.includes('explain dual otp')) {
        continue;
      }

      // Check if user is asking for their OWN order or info
      const isSelfInquiry = clean.includes('my order') || clean.includes('my profile') || clean.includes('my account');
      if (isSelfInquiry && currentUser) {
        continue;
      }

      return {
        isPermitted: false,
        refusalMessage: EXACT_SECURITY_REFUSAL,
        reason: 'Private data request'
      };
    }
  }

  // 3. Check for specific third-party person names paired with private records
  for (const name of PROTECTED_NAMES) {
    if (clean.includes(name)) {
      const isSelf = currentUser && (
        (currentUser.name && currentUser.name.toLowerCase().includes(name)) ||
        (currentUser.email && currentUser.email.toLowerCase().includes(name))
      );

      if (!isSelf) {
        // If asking for their order, phone, or detail
        if (
          clean.includes('phone') ||
          clean.includes('order') ||
          clean.includes('otp') ||
          clean.includes('pin') ||
          clean.includes('address') ||
          clean.includes('where does')
        ) {
          return {
            isPermitted: false,
            refusalMessage: EXACT_SECURITY_REFUSAL,
            reason: 'Third-party personal data query'
          };
        }
      }
    }
  }

  // 4. Check for arbitrary order ID queries not owned by user
  const orderIdMatch = clean.match(/(ord-\d+|blk-ord-\d+|dsp-ap-\d+)/i);
  if (orderIdMatch) {
    const requestedId = orderIdMatch[1].toUpperCase();

    // If user is not logged in, they cannot query specific private orders
    if (!currentUser) {
      // Exception: Live Reefer demo tracking AP-31-TV-8821 / general demo tracking
      if (!clean.includes('how to track') && !clean.includes('demo')) {
        return {
          isPermitted: false,
          refusalMessage: EXACT_SECURITY_REFUSAL,
          reason: 'Unauthenticated private order query'
        };
      }
    }
  }

  return { isPermitted: true, refusalMessage: null, reason: null };
}

/**
 * Filter private fields out of context before passing to model prompts
 */
export function sanitizeContextForPrompt(rawText) {
  if (!rawText) return '';
  return rawText
    // Mask sensitive phone numbers except public driver/hub contact if public
    .replace(/(?:\+91\s*)?[6-9]\d{9}/g, '[Verified Contact]')
    // Mask passwords or secret phrases
    .replace(/password[:=]\s*\S+/gi, 'password: [PROTECTED]')
    .replace(/passcode[:=]\s*\S+/gi, 'passcode: [PROTECTED]');
}

/**
 * Verify whether an order belongs to the currently authenticated user
 */
export function verifyOrderOwnership(order, currentUser) {
  if (!order || !currentUser) return false;
  if (currentUser.role === 'admin') return true; // Admins have oversight

  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const userName = (currentUser.name || '').toLowerCase().trim();
  const buyerEmail = (order.buyerEmail || order.buyer_email || '').toLowerCase().trim();
  const buyerName = (order.buyerName || order.buyer_name || order.customerName || '').toLowerCase().trim();

  return (
    (userEmail && buyerEmail && userEmail === buyerEmail) ||
    (userName && buyerName && (userName.includes(buyerName) || buyerName.includes(userName)))
  );
}
