# 🤖 AGENTS.md — AI Agent Directives & Engineering Standards

> This document defines the operating rules, design systems, and behavioral enforcement directives for all AI coding agents working on this codebase.

---

## ⚡ Primary Directive: Strict UI/UX Anti-Slop Enforcement

All AI agents modifying or generating user interfaces, React components, Tailwind CSS styling, or frontend layouts **MUST** adhere to the **`unslop`** design system located at:
👉 **[`.agents/skills/unslop/SKILL.md`](file:///.agents/skills/unslop/SKILL.md)**

Generic "AI-generated" or "vibecoded" aesthetic clichés are strictly prohibited. Every screen must look like a deliberate, senior-designed interface tailored specifically to this product's domain.

---

## 🚫 Prohibited AI Slop Clichés (Strictly Forbidden)

1. **No Glowing Blur Blobs or Meshes:**
   - Never add decorative `blur-xl`, `blur-2xl`, or `blur-3xl` colored blobs behind icons, cards, logos, or hero sections.
2. **No Gradient Text Clipping:**
   - Never use `bg-gradient-to-r ... bg-clip-text text-transparent` on headlines or titles. Use solid, high-contrast typography.
3. **No Mouse-Following Spotlight Auras:**
   - Never attach `onMouseMove` handlers to render cursor-tracking radial glow overlays (`radial-gradient(...)`).
4. **No Emoji Clutter in UI Navigation or Actions:**
   - Never use emojis (`👉`, `🛒`, `🌾`, `🛡️`, `🚚`, `🏪`, `📦`, `🔑`, `✨`) as button icons or list bullets.
   - Always use monochrome Lucide SVG icons (`ShoppingCart`, `Sprout`, `ShieldCheck`, `Truck`, `Store`, etc.) with consistent sizing (`14px`–`18px`) and stroke width (`1.5` or `1.75`).
5. **No Pointless Animated Loops:**
   - Never apply infinite looping animations (`animate-bounce`, `animate-pulse`, `animate-ping`) to static UI elements, cards, or scroll indicators.
   - Restrict motion strictly to purposeful, snappy micro-interactions (`transition-colors duration-150`, active presses, modal fades).
6. **No White Text Halo Shadows:**
   - Never use `drop-shadow-[0_2px_12px_rgba(255,255,255,...)]` to compensate for poor background contrast. Solve contrast structurally using solid backing surfaces or calibrated scrims.
7. **No Vague or Superlative Marketing Copy:**
   - Avoid empty buzzwords ("state-of-the-art", "cutting-edge", "game-changing", "revolutionary", "seamlessly integrated"). Write direct, empirical, engineering-grade descriptions.
8. **No Orphaned Dark-Mode Classes:**
   - Do not leave stray `dark:` utility classes (e.g., `dark:bg-slate-900`) in light-themed components.

---

## 🎨 Design Philosophy: "Quiet Chrome, Focused Richness"

- **Chrome Stays Quiet:** Backgrounds, navigation bars, borders, and utility buttons should be clean, solid, and subdued.
- **Richness Belongs to Content:** Visual color, texture, and depth must come from actual product data—live IoT cold-chain telemetry, fresh harvest inventory, weighbridge ledgers, and price collar graphs.
- **Brand Palette Discipline:**
  - **Forest Green:** `#102F27` (Deep) / `#185844` (Primary)
  - **Warm Paper:** `#F2EBDD` (Base BG) / `#FAF6EF` (Card Surface) / `#EBE3D3` (Muted)
  - **Sage Grey:** `#78947F` (Borders & Muted Text)
  - **Earth Gold:** `#B08A4F` (Accents)

---

## 📐 The 9-Pass Ordered Refactoring Protocol

When creating, refactoring, or auditing any UI component, execute changes strictly in this order:

1. **Spacing:** Enforce standard 4px/8px rhythm (`p-4`, `p-6`, `gap-4`, `gap-6`). Group related elements closer than unrelated ones.
2. **Color:** Restrain palettes. Use honest 1px borders (`border border-[#78947F]/30`) instead of gradient borders or shadows.
3. **Icons:** Standardize with unified Lucide SVGs. Never mix emojis and SVGs.
4. **Copy:** Eliminate exclamation marks, hype words, and filler greeting headlines.
5. **Typography:** Maintain a strict 3-tier typographic scale with readable line heights and weights.
6. **Layout:** Preserve logical hierarchy. Ensure primary cards have grounded, intentional proportions.
7. **Details:** Enforce the Nested Radius rule: $R_{\text{inner}} = R_{\text{outer}} - \text{padding}$.
8. **Visuals:** Ground imagery in real domain content (farmgate harvest, reefer fleet, telemetry maps).
9. **Motion:** Keep transitions snappy ($\le 200\text{ms}$) and user-triggered only.

---

## 🛠️ Skills & Tooling Integration

- **Unslop Skill Location:** `.agents/skills/unslop/SKILL.md`
- **Playwright Snapshot Scripts:** `.agents/skills/unslop/scripts/snapshot.mjs`
- **Story Generator:** `.agents/skills/unslop/scripts/story.mjs`

To audit a component or screen, read `.agents/skills/unslop/SKILL.md` and execute the 9 passes systematically.

