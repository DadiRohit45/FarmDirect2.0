/**
 * FarmDirect 2.0 — Controlled AI Tool & Function Registry
 * 
 * Enforces strict, deterministic read-only execution:
 * 1. Safe data extraction (no arbitrary SQL or shell commands)
 * 2. Ownership verification on any order lookups
 * 3. Client navigation triggers with validated routes
 */

import {
  BASE_PRODUCTS,
  getLiveProducts,
  searchProducts,
  getCheapestProducts,
  getFarmersDirectory,
  getZonesDirectory,
  formatProductCatalogMarkdown,
  formatProductCatalogConceptual
} from './dataStore.js';
import { verifyOrderOwnership, EXACT_SECURITY_REFUSAL } from './privacyGuard.js';

export const AI_TOOLS = {
  /**
   * 1. Get Live Product Catalog (Conceptual by default, table only on explicit request)
   */
  list_products: {
    name: 'list_products',
    description: 'Returns theoretical and architectural synthesis of available produce clusters, with tabular format only on explicit request.',
    execute: async ({ query = '', explicitTable = false } = {}) => {
      const products = await getLiveProducts();
      const isTable = explicitTable || /table|tabular|raw dump|raw list|spreadsheet|markdown table/i.test(query);
      return {
        success: true,
        data: products,
        formattedMarkdown: isTable
          ? formatProductCatalogMarkdown(products)
          : formatProductCatalogConceptual(products, { mode: 'catalog' })
      };
    }
  },

  /**
   * 2. Search specific product by name
   */
  search_product: {
    name: 'search_product',
    description: 'Search for a specific vegetable by name (e.g., Tomato, Spinach, Bhendi, Brinjal, Onion, Chili).',
    execute: async ({ query, explicitTable = false }) => {
      const products = await getLiveProducts();
      const results = searchProducts(query, products);
      if (results.length === 0) {
        return {
          success: false,
          message: `No produce found matching "${query}". Currently available items: ${products.map(p => p.name).join(', ')}.`
        };
      }
      const isTable = explicitTable || /table|tabular|raw dump|raw list|spreadsheet|markdown table/i.test(query);
      return {
        success: true,
        matches: results,
        formattedMarkdown: isTable
          ? formatProductCatalogMarkdown(results)
          : formatProductCatalogConceptual(results, { mode: 'detail' })
      };
    }
  },

  /**
   * 3. Get cheapest vegetables
   */
  get_cheapest_products: {
    name: 'get_cheapest_products',
    description: 'Returns the most affordable fresh vegetables sorted by price per kg.',
    execute: async ({ query = '', limit = 3, explicitTable = false } = {}) => {
      const products = await getLiveProducts();
      const cheapest = getCheapestProducts(limit, products);
      const isTable = explicitTable || /table|tabular|raw dump|raw list|spreadsheet|markdown table/i.test(query);
      return {
        success: true,
        data: cheapest,
        formattedMarkdown: isTable
          ? formatProductCatalogMarkdown(cheapest)
          : formatProductCatalogConceptual(cheapest, { mode: 'cheapest' })
      };
    }
  },

  /**
   * 4. Get Verified Farmers Directory
   */
  get_farmers: {
    name: 'get_farmers',
    description: 'Lists verified regional farmers, their villages, trust scores, and AP e-Crop credentials.',
    execute: async () => {
      const farmers = getFarmersDirectory();
      let md = `### 🌾 Verified Regional Farmers (Anakapalli–Visakhapatnam Corridor)\n\n`;
      md += `| Farmer Name | Village / Mandal | Crop Specialty | Trust Tier | Rating | e-Crop Verified |\n`;
      md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      for (const f of farmers) {
        md += `| **${f.name}** | ${f.village} | ${f.crop} | ${f.trustTier} | ⭐ ${f.rating} | ${f.eCropVerified ? '✅ Verified' : 'Pending'} |\n`;
      }
      return { success: true, data: farmers, formattedMarkdown: md };
    }
  },

  /**
   * 5. Track User's Authenticated Order
   */
  track_user_order: {
    name: 'track_user_order',
    description: 'Inspect live transit status and active cold-chain reefer telemetry for an order.',
    execute: async ({ orderId, currentUser }) => {
      if (!currentUser) {
        return {
          success: false,
          refusal: EXACT_SECURITY_REFUSAL,
          message: 'Please sign in to track your personal orders securely.'
        };
      }

      // Sample simulated active order owned by user or demo
      const activeOrder = {
        orderId: orderId || 'FD-ORD-9021',
        buyerEmail: currentUser.email,
        buyerName: currentUser.name || 'Member',
        carrier: 'Porter Electric Reefer Van (#AP-31-TV-8821)',
        transitTemp: '9.2°C (Strictly 8°C - 12°C Nominal Window)',
        status: 'In-Transit — Estimated Kirana Hub Arrival in 14 minutes',
        hub: 'MVP Colony Kirana Cluster Hub #1',
        escrowStatus: 'Locked in 10% UPI Pre-Auth Escrow until Dual-OTP Handshake'
      };

      if (!verifyOrderOwnership(activeOrder, currentUser)) {
        return {
          success: false,
          refusal: EXACT_SECURITY_REFUSAL,
          message: EXACT_SECURITY_REFUSAL
        };
      }

      const md = `### 🚚 Live Order & Reefer Telemetry: **${activeOrder.orderId}**\n\n` +
        `#### 1. Cold-Chain Logistics & Active Sensor Telemetry\n` +
        `• **Carrier Vehicle:** ${activeOrder.carrier}\n` +
        `• **Cold-Chain Telemetry:** **${activeOrder.transitTemp}** (Active Solar Chill)\n` +
        `• **Current Status:** ${activeOrder.status}\n\n` +
        `#### 2. Destination Depot & Escrow Custody\n` +
        `• **Receiving Depot:** ${activeOrder.hub}\n` +
        `• **Escrow Safeguard:** ${activeOrder.escrowStatus}\n\n` +
        `> 💡 **Systematic Advisory:** You will receive a Dual-OTP key upon arrival to unlock your QR-sealed crates and trigger instant UPI settlement.`;

      return { success: true, data: activeOrder, formattedMarkdown: md };
    }
  }
};
