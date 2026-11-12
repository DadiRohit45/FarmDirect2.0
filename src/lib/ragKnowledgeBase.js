/**
 * FarmDirect 2.0 RAG Knowledge Base
 * Comprehensive indexed knowledge chunks grounded in the capstone whitepaper,
 * mathematical formulations, Andhra Pradesh agro-corridor logistics,
 * farmer schemes (RWBCIS), algorithmic pricing, and multi-actor workflows.
 */

export const RAG_KNOWLEDGE_BASE = [
  // 1. RWBCIS Scheme
  {
    id: 'rwbcis-scheme-overview',
    category: 'schemes',
    title: 'Restructured Weather Based Crop Insurance Scheme (RWBCIS)',
    keywords: [
      'rwbcis', 'insurance', 'crop insurance', 'weather', 'bima', 'climate',
      'subsidy', 'premium', 'parametric', 'kasimkota', 'anandapuram', 'payout',
      'dbt', 'deficit', 'rainfall', 'temperature', 'cyclone', 'drought', 'heatwave'
    ],
    summary: 'Parametric weather shield for horticultural and vegetable crops with 1.5% farmer premium and automated AWS trigger payouts.',
    content: `The Restructured Weather Based Crop Insurance Scheme (RWBCIS) is integrated into FarmDirect 2.0 as an automated parametric weather shield specifically tailored for perishable horticultural and vegetable crops (e.g., Hybrid Tomatoes, Brinjal, Bhendi, Chillies) in the Anakapalli–Pendurthi–Visakhapatnam corridor.

Key Highlights:
1. Premium Cost Structure:
   - Farmer Share: Exactly 1.5% of the total sum insured (e.g., ₹330/acre for ₹22,000 coverage).
   - Government Subsidy: 98.5% split equally between Central and Andhra Pradesh State governments (₹21,670/acre subsidy).
2. Autonomous Parametric Triggers:
   - Linked directly to real-time IoT Automatic Weather Stations (AWS): Kasimkota (#AP-MET-14) and Anandapuram (#AP-MET-09).
   - Payout triggers are parameter-based: Rainfall Deficit exceeding 45% during flowering/fruit set, or severe heat waves (>38°C for 3 consecutive days), or coastal cyclonic depressions (>90mm rainfall in 24 hours).
3. Zero-Survey Automated Settlement:
   - Eliminates traditional 6-month physical revenue officer field loss surveys.
   - Parametric dossiers are compiled autonomously within 240 seconds of sensor threshold breaches, routing Direct Benefit Transfer (DBT) directly to the farmer's registered UPI/Aadhaar bank account.`,
    action: {
      label: 'Open RWBCIS Portal',
      hash: '#rwbcis',
      view: 'farmer'
    }
  },

  // 2. Algorithmic Price Collar
  {
    id: 'algorithmic-price-collar',
    category: 'pricing',
    title: 'Algorithmic Price Collar Bounding (±15% Fair Volatility Collar)',
    keywords: [
      'price collar', 'collar', 'algorithm', 'formula', 'pricing', 'mandi',
      'apmc', 'volatility', 'floor', 'ceiling', 'risk pool', 'p_settle',
      'distress sale', 'crash', 'spike', 'math', 'agmarknet'
    ],
    summary: 'FinTech mechanism bounding settlement prices between 85% and 115% of the 30-day baseline, backed by a 2% platform risk pool.',
    content: `FarmDirect 2.0 eliminates predatory APMC mandi volatility using an Algorithmic Price Collar bounded at ±15%:

Mathematical Formulation:
P_settle = max(0.85 · P0, min(1.15 · P0, P_mandi))

Where:
- P0 = 30-day rolling weighted baseline cost of cultivation + fair living wage for the specific agro-cluster.
- P_mandi = Real-time AGMARKNET spot market price at Anandapuram/Anakapalli mandis.
- Floor Bounding (0.85 · P0): If a localized mandi glut causes spot prices to crash below 85% of baseline, the farmer is protected by the contractual floor. The deficit is funded by the 2% Platform Risk Reserve Pool.
- Ceiling Bounding (1.15 · P0): If retail supply shocks spike open-market prices, institutional anchors and consumers are capped at 115% of baseline, ensuring price stability.
- Zero Middleman Toll: Traditional mandi middlemen deduct 12-18% in commissions, loading charges, and unauthorized weight cuts. FarmDirect 2.0 settles 100% of the collar price directly to the farmer.`,
    action: {
      label: 'View Price Analysis',
      hash: '#farmer',
      view: 'farmer'
    }
  },

  // 3. Multi-Attribute Match Score (Gale-Shapley Matching)
  {
    id: 'multi-attribute-matching',
    category: 'algorithms',
    title: 'Multi-Attribute Gale-Shapley Matching Algorithm',
    keywords: [
      'matching', 'gale shapley', 'matchscore', 'algorithm', 'formula',
      'distance', 'trust score', 'volume', 'weight', 'allocation', 'directed dispatch'
    ],
    summary: 'Mathematical matching function balancing geographical distance, historical trust score, and volume compatibility.',
    content: `FarmDirect 2.0 pairs harvested supply with aggregated demand using a multi-attribute Gale-Shapley stable allocation model:

Mathematical Formulation:
MatchScore(i) = w1 · (1 - di / Dmax) + w2 · TrustScore(i) + w3 · (1 - |Vi - V*| / V*)

Parameters:
- di / Dmax: Normalized road network transit distance between farm cluster and receiving dock/hub. Weight w1 = 0.40.
- TrustScore(i): Multi-factor historical reliability score (weighbridge accuracy, grading adherence, on-time dock dispatch). Weight w2 = 0.35.
- |Vi - V*| / V*: Volumetric variance between farmer crate batch yield (Vi) and buyer required lot size (V*). Weight w3 = 0.25.

Why this matters:
Matches are calculated centrally in under 15 minutes. Farmers do not spend time haggling or browsing buyer catalogs; instead, they receive pre-verified 'Directed Dispatch' purchase contracts backed by escrow.`,
    action: {
      label: 'Explore System Architecture',
      hash: '#home',
      view: 'home'
    }
  },

  // 4. Reverse-Demand Ingestion & Anchor Piggybacking
  {
    id: 'reverse-demand-ingestion',
    category: 'architecture',
    title: 'Reverse-Demand Ingestion & Anchor Piggybacking',
    keywords: [
      'reverse demand', 'anchor', 'piggybacking', 'logistics', 'delivery cost',
      'institutional', 'novotel', 'mess', 'canteen', 'forward contract', 'speculation'
    ],
    summary: 'Aggregating bulk institutional contracts to carry retail micro-orders, driving marginal delivery cost down from ₹45 to ₹0.85.',
    content: `Traditional agriculture is reactive and speculative: farmers harvest crops without knowing who will buy them or at what price.

FarmDirect 2.0 flips this with Reverse-Demand Ingestion:
1. Institutional Anchors First:
   - High-volume buyers (e.g., Novotel Varun Beach, Andhra University hostels, hospital canteens) submit forward requisitions 24-48 hours in advance for 100kg-500kg lots.
2. Anchor Piggybacking:
   - Scheduled 3PL refrigerated trunk routes carrying 2-ton anchor consignments have excess volumetric and weight capacity.
   - Household micro-orders (1-5kg crates) heading to neighborhood Kirana hubs along the same trunk corridor are piggybacked onto the anchor manifest.
3. Radical Cost Reduction:
   - Marginal transit cost per residential micro-order plummets from ₹45.00 down to ₹0.85.
   - Spoilage rates drop from industry average 35% down to under 2.1%.`,
    action: {
      label: 'Explore Bulk Procurement',
      hash: '#bulk',
      view: 'customer'
    }
  },

  // 5. Live Cold-Chain Reefer Logistics & Order Tracking
  {
    id: 'cold-chain-tracking',
    category: 'logistics',
    title: 'Live 3PL Reefer Fleet Telemetry & Order Tracking',
    keywords: [
      'tracking', 'order tracking', 'cold chain', 'reefer', 'temperature',
      'porter', 'driver', 'ap-31-tv-8821', 'vehicle', 'dispatch', 'transit',
      'steps', 'stepper', 'status', 'iot', 'thermometer'
    ],
    summary: 'Active solar-assisted refrigeration (8-12°C), real-time IoT cargo temperature gauges, and 6-step lifecycle tracking.',
    content: `FarmDirect 2.0 maintains uninterrupted cold-chain integrity across the Anandapuram–Visakhapatnam transit corridor:

Logistics Specifications:
1. Fleet & Equipment:
   - Dedicated Porter Electric and Solar-Assisted Reefer Vans (e.g., Vehicle #AP-31-TV-8821).
   - Driver Contact: Suresh Maddala (+91 98480 33441) with GPS live geofencing.
2. Thermal Telemetry:
   - Continuous IoT cargo temperature monitoring held strictly between 8.0°C and 12.0°C (current telemetry reading: 10.4°C).
   - If cargo temperature breaches 14.5°C for more than 20 minutes, an automated quality alert triggers.
3. 6-Step Verifiable Lifecycle:
   - Step 1: Safe Contract Accepted & Escrow Funded.
   - Step 2: QR Bags Weighed & Tamper Sealed (Gross 26.2kg / Net 25.0kg per crate).
   - Step 3: Farmgate 3PL Reefer Pickup Handshake.
   - Step 4: Cold-Chain Line-Haul Transit.
   - Step 5: Hub Receiving Bay Weighbridge & Tamper Scan.
   - Step 6: Dual-OTP Handshake & Instant UPI Escrow Release.`,
    action: {
      label: 'Open Live Order Tracking',
      hash: '#tracking',
      view: 'customer'
    }
  },

  // 6. Farmer Blind Yield & Instant UPI Escrow Payouts
  {
    id: 'farmer-blind-yield-escrow',
    category: 'farmer',
    title: 'Farmer Blind Yield Entry & Instant UPI Escrow Settlement',
    keywords: [
      'farmer', 'blind yield', 'yield entry', 'e-crop', 'upi', 'escrow',
      'payout', 'weighbridge', 'crate', 'gross weight', 'tare', 'qr bags',
      'tamper', '6 seconds'
    ],
    summary: 'Farmers log harvest without speculative browsing; weighbridge scans release escrow funds to farmer UPI within 6-8 seconds.',
    content: `How farmers operate on FarmDirect 2.0:

1. Blind Yield Input (Zero Browsing):
   - Farmers do not browse consumer demand or compete in bidding wars.
   - They simply enter crop name, estimated harvest quantity (e.g., 350kg), acreage, harvest dawn time, and reserve floor price.
   - Voice logging in Telugu or English is supported.
2. Verified Farm Identity:
   - Integrates with AP e-Crop land registry and Rythu Bharosa Kendra (RBK) farmer IDs for seamless credentialing.
3. QR Crate Standardization:
   - Harvest is packed into standardized crates: Tare weight is exactly 1.2kg, gross weight 26.2kg (net produce 25.0kg).
   - Tamper-evident serialized QR codes ensure produce cannot be swapped or diluted during transit.
4. Instant UPI Payout:
   - As soon as the receiving hub or anchor dock scans the QR crate on its calibrated digital scale, the escrow smart contract triggers.
   - Funds are credited via UPI (e.g., UPI/2026/AP/98124098) in 6 to 8 seconds with zero commission deductions.`,
    action: {
      label: 'Farmer Harvest Portal',
      hash: '#farmer',
      view: 'farmer'
    }
  },

  // 7. Kirana Hub Micro-Depots & Dual-OTP Handshake
  {
    id: 'kirana-hub-depot',
    category: 'kirana',
    title: 'Hyperlocal Kirana Hub Micro-Depots & Dual-OTP Verification',
    keywords: [
      'kirana', 'hub', 'micro depot', 'mvp colony', 'seethammadhara', 'dual otp',
      'otp', 'pickup', 'crate return', 'buffer', 'handling commission', 'scale'
    ],
    summary: 'Decentralized urban neighborhood grocery shops acting as zero-capex cold depots with Dual-OTP pickup handshake.',
    content: `FarmDirect 2.0 converts existing neighborhood Kirana stores into decentralized micro-distribution nodes:

1. Zero-Capex Urban Cold Depots:
   - Located within 800m walking radius of residential neighborhoods (e.g., MVP Colony Hub #1, Seethammadhara Hub #3).
   - Eliminates need for multi-crore central cold storage warehouses.
2. Dual-OTP Handshake:
   - When the consumer arrives at their local Kirana hub for pickup, both merchant and customer must verify the 4-digit code (e.g., 'FD-4821').
   - This prevents misplacement, fraudulent pickups, or inventory theft.
3. Earned Security Buffer:
   - Kirana merchants earn handling commissions per crate and build a ₹500 platform collateral buffer via handling fee splits: Buffer(t+1) = Buffer(t) + 0.50 · Fee_handling.
4. Circular Crate Deposit:
   - Consumers pay a ₹50 refundable crate deposit, automatically credited back to their wallet upon returning empty reusable crates to any partner Kirana hub.`,
    action: {
      label: 'Open Kirana Hub Portal',
      hash: '#kirana',
      view: 'kirana'
    }
  },

  // 8. Customer Fresh Retail & Quality Assurance
  {
    id: 'customer-retail-quality',
    category: 'customer',
    title: 'Customer Sunrise Harvest & Zero Pesticide Quality Assurance',
    keywords: [
      'customer', 'consumer', 'retail', 'vegetables', 'fresh', 'pesticide',
      'residue', 'lab report', 'harvest time', 'dawn', 'shelf life', 'refund', 'replacement'
    ],
    summary: 'Produce harvested at 5:00 AM, delivered by 7:30 AM with 0.00% chemical residue lab verification and 2-hour replacement SLA.',
    content: `Why FarmDirect 2.0 produce is superior to conventional supermarkets and dark stores:

1. Dawn-to-Fork Speed:
   - Conventional supermarket produce is 3 to 5 days old, sitting in refrigerated holding docks with degraded vitamins.
   - FarmDirect 2.0 produce is harvested at dawn (05:00 AM) and ready for neighborhood pickup or delivery by 07:15 AM (under 3 hours post-harvest).
2. Certified Quality & Lab Testing:
   - 0.00% synthetic chemical residues tested via Regional Agrochemical Labs (Government Analyst Report AP-QCL-2026-881).
   - Bounded microbial count, zero artificial ripening agents (no calcium carbide).
3. 2-Hour Hassle-Free Replacement:
   - If any crate or batch has bruised or substandard produce, customers report it via the app with a photo and receive instant wallet credit or a fresh crate delivery within 2 hours.
4. Flexible Subscription Basket:
   - Families can subscribe to bi-weekly fresh harvest baskets (7kg assorted seasonal vegetables) delivered every Tuesday and Friday morning.`,
    action: {
      label: 'Browse Fresh Market',
      hash: '#customer',
      view: 'customer'
    }
  },

  // 9. Bulk Institutional Procurement
  {
    id: 'bulk-institutional-procurement',
    category: 'bulk',
    title: 'Bulk Institutional Procurement & Forward Contracts',
    keywords: [
      'bulk', 'institutional', 'anchor', 'hotels', 'mess', 'canteen',
      '50kg', 'forward contract', 'novotel', 'requisition', 'escrow', 'tier discount'
    ],
    summary: 'Forward requisitions for 50kg+ consignments with automated farmer lot matching, escrow lock, and scheduled 06:30 AM delivery.',
    content: `FarmDirect 2.0 provides enterprise-grade direct farm procurement for institutional buyers:

1. Target Institutional Buyers:
   - Star hotels (Novotel, Gateway), university hostels (AU, GITAM), corporate cafeterias, and hospital mess kitchens.
2. Volume Tiers & Pricing:
   - Minimum requisition size: 50kg per line item.
   - Tier 1 (50-200kg): 12% below retail market rates.
   - Tier 2 (201-500kg): 18% below retail market rates.
   - Tier 3 (500kg+): Custom farmgate contract with dedicated harvest block allocation.
3. Automated Match Desk:
   - Buyers specify crop variety (e.g., Grade A Table-Ready Tomato), quantity, target ceiling price, and delivery window (e.g., Tomorrow 06:30 AM).
   - The platform calculates matching farmer offers in real time, locks funds into secure escrow, and generates unified dispatch manifests.`,
    action: {
      label: 'Open Bulk Order Desk',
      hash: '#bulk',
      view: 'customer'
    }
  },

  // 10. Platform Security, Credentials & Admin Governance
  {
    id: 'admin-governance-credentials',
    category: 'admin',
    title: 'Platform Administration, Access Control & Credentials',
    keywords: [
      'admin', 'credentials', 'login', 'email', 'password', 'security',
      'supabase', 'tables', 'database', 'roles', 'audit', 'admin.farmdirect.in'
    ],
    summary: 'Strict system administrator access protocol and live Supabase activities management.',
    content: `FarmDirect 2.0 enforces role-based access control (RBAC) across Farmers, Customers, Kirana Merchants, and System Administrators:

1. System Admin Credentials:
   - In accordance with platform governance, System Admin access is exclusively accessible with:
     * Email: Admin.farmdirect.in
     * Password: [Configured Master Passcode]
   - The admin panel is completely hidden from public login and registration options to prevent unauthorized access.
2. Admin Database Management:
   - Live Supabase connection inspector provides real-time audit logs, active order dispatches, user registries, and settlement records across 8 relational tables.
3. User Credential Flow:
   - Customers and Bulk buyers share unified credentials; once logged in, customer accounts can seamlessly switch between household retail and 50kg+ bulk forward orders.`,
    action: {
      label: 'Open Admin Console',
      hash: '#admin',
      view: 'admin'
    }
  },

  // 11. Day-Zero SOS & Disaster Protocol
  {
    id: 'day-zero-sos-disaster',
    category: 'resilience',
    title: 'Day-Zero SOS Extreme Weather Protocol',
    keywords: [
      'sos', 'disaster', 'cyclone', 'flood', 'rain', 'extreme weather',
      'bay of bengal', 'split node', 'rerouting', 'risk pool', 'emergency'
    ],
    summary: 'Dynamic split-node graph routing and emergency 3PL dispatch when coastal depressions impact transport corridors.',
    content: `The Visakhapatnam-Anakapalli agro-corridor is prone to Bay of Bengal cyclonic depressions and flash flooding:

1. Automatic Incident Trigger:
   - When OpenWeather and Mandal AWS telemetry report rainfall exceeding 70mm/hr or wind gusts over 65 km/h, the platform automatically activates the Day-Zero SOS Protocol.
2. Split-Node Graph Routing:
   - Blocked arterial roads (e.g., NH-16 inundation near Sabbavaram) are marked impaired on the PostGIS transport graph.
   - Algorithms dynamically split delivery nodes, rerouting consignments to unaffected secondary highway clusters.
3. Emergency Risk Funding:
   - Emergency freight premiums are funded directly from the 2% Platform Risk Reserve Pool without penalizing farmers or inflating consumer prices.
   - Parametric RWBCIS claim dossiers are automatically generated and queued for government adjuster sign-off.`,
    action: {
      label: 'View Platform Resilience',
      hash: '#rwbcis',
      view: 'farmer'
    }
  }
];

/**
 * Frequently Asked Questions (Pre-computed query accelerators)
 */
export const RAG_SAMPLE_QUESTIONS = [
  {
    query: 'List the available products',
    category: 'products',
    icon: 'ShoppingBag'
  },
  {
    query: 'Which products are cheapest?',
    category: 'pricing',
    icon: 'TrendingUp'
  },
  {
    query: 'How does the RWBCIS insurance scheme work?',
    category: 'schemes',
    icon: 'ShieldCheck'
  },
  {
    query: 'Explain the ±15% Price Collar formula',
    category: 'pricing',
    icon: 'TrendingUp'
  },
  {
    query: 'Track my order & check Reefer temperature',
    category: 'logistics',
    icon: 'Truck'
  },
  {
    query: 'How do I log my harvest as a farmer?',
    category: 'farmer',
    icon: 'Sprout'
  },
  {
    query: 'What is Reverse-Demand Matching?',
    category: 'architecture',
    icon: 'Zap'
  },
  {
    query: 'How do Kirana hubs handle Dual-OTP pickup?',
    category: 'kirana',
    icon: 'Store'
  }
];
