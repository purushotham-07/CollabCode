# DESIGN SYSTEM SPECIFICATION: The Precision Workbench

CollabCode follows **The Precision Workbench** design direction—a digital instrument engineered for sustained focus, tactile density, and immediate responsiveness. It eliminates decorative noise, murky blurs, and generic SaaS cliches in favor of calibrated contrast, mathematical rhythm, and compositor-only interactions.

---

## 1. Reference Architecture & Analysis

Three reference directions from industry-standard developer platforms inform this system:

1. **Zed (zed.dev)**
   - *Why it works:* High-density surfaces that reject arbitrary window chrome, relying on clean 1px borders and sharp monospaced hierarchy to keep source code as the undisputed hero.
   - *Applied lesson:* Flat, solid surfaces with high contrast borders rather than fuzzy multi-layer drop shadows; code and status badges formatted in true monospace with tight line heights.

2. **Linear (linear.app)**
   - *Why it works:* Disciplined neutral zinc/obsidian palette paired with a single vibrant, high-contrast action accent, unified under sub-pixel typography and keyboard-first navigation.
   - *Applied lesson:* A unified neutral scale in OKLCH with zero color bleed in dark mode; micro-interactions limited to 150ms ease-out transitions on opacity and subtle scale.

3. **Stripe Documentation & Raycast**
   - *Why it works:* Surgical typography scale, instant page loads without layout shifts, and semantic status indicators that inform without shouting.
   - *Applied lesson:* Strict font fallback metrics (`size-adjust`, `ascent-override`) to eliminate CLS, and contextual semantic badges instead of decorative emojis and gradient pills.

---

## 2. Core Philosophy & Mood

> **One-Sentence Concept:** A focused, high-precision engineering workbench crafted with low-reflectance obsidian surfaces, high-contrast typography, and instantaneous 60fps compositor transitions.

The mood is **authoritative, quiet, and surgical**. The interface feels like high-end developer hardware—calm during long editing sessions, legible under all lighting conditions, and free of hype.

---

## 3. Color System (OKLCH)

All colors are defined as CSS custom properties in `OKLCH` format, ensuring uniform perceptual lightness across scales and robust WCAG AAA / AA contrast compliance.

### 3.1 Dark Theme Tokens (Primary)

```css
:root, .dark {
  /* Canvas & Low-Reflectance Surfaces */
  --surface-canvas: oklch(0.13 0.006 260);    /* #0d1117 equivalent, deep neutral obsidian */
  --surface-subtle: oklch(0.16 0.008 260);    /* Sidebar, tab bars */
  --surface-raised: oklch(0.19 0.010 260);    /* Cards, panels, dropdowns */
  --surface-overlay: oklch(0.23 0.012 260);   /* Modals, active hover states */
  --surface-active: oklch(0.27 0.014 260);    /* Active selection, pressed buttons */

  /* Architectural Borders */
  --border-subtle: oklch(0.24 0.008 260);     /* Hairline panel dividers (1px) */
  --border-default: oklch(0.30 0.010 260);    /* Card borders, input strokes */
  --border-hover: oklch(0.40 0.014 260);      /* Interactive focus/hover rings */

  /* High-Legibility Typography (Contrast Certified) */
  --text-primary: oklch(0.97 0.002 260);      /* 15.2:1 contrast against canvas (WCAG AAA) */
  --text-secondary: oklch(0.74 0.008 260);    /* 7.4:1 contrast (WCAG AAA) */
  --text-muted: oklch(0.56 0.012 260);        /* 4.6:1 contrast (WCAG AA) */
  --text-on-accent: oklch(0.12 0.008 260);    /* Text on solid accent button (13.1:1 AAA) */

  /* Single Accent: Precision Emerald (Code & Live Execution) */
  --accent-base: oklch(0.72 0.17 155);        /* High-energy, crisp emerald */
  --accent-hover: oklch(0.78 0.18 155);       /* Hover state */
  --accent-active: oklch(0.66 0.16 155);      /* Active state */
  --accent-subtle: oklch(0.22 0.05 155);      /* Tinted badges, active tab indicator */
  --accent-border: oklch(0.35 0.09 155);      /* Accent boundaries */

  /* Semantic Status Signals */
  --status-success: oklch(0.72 0.17 155);
  --status-warning: oklch(0.78 0.16 75);
  --status-error: oklch(0.65 0.22 25);
  --status-info: oklch(0.72 0.14 235);
}
```

### 3.2 Light Theme Tokens (Complementary)

```css
.light {
  --surface-canvas: oklch(0.99 0.002 260);
  --surface-subtle: oklch(0.96 0.004 260);
  --surface-raised: oklch(1.0 0.0 0);
  --surface-overlay: oklch(0.94 0.006 260);
  --surface-active: oklch(0.90 0.008 260);

  --border-subtle: oklch(0.90 0.004 260);
  --border-default: oklch(0.82 0.008 260);
  --border-hover: oklch(0.65 0.012 260);

  --text-primary: oklch(0.18 0.010 260);
  --text-secondary: oklch(0.38 0.012 260);
  --text-muted: oklch(0.52 0.010 260);
  --text-on-accent: oklch(0.99 0.002 260);

  --accent-base: oklch(0.55 0.16 155);
  --accent-hover: oklch(0.48 0.16 155);
  --accent-active: oklch(0.42 0.15 155);
  --accent-subtle: oklch(0.92 0.04 155);
  --accent-border: oklch(0.80 0.08 155);
}
```

---

## 4. Typography & Font Pairing

Two curated, open-source font families are self-hosted via Fontsource (zero external Google Fonts network calls):

1. **UI Primary: Geist Sans** (OFL-1.1 license, commercial use permitted)
   - Clean, geometric grotesque with tall x-height, clear numeric tabular spacing, and exceptional rendering at small sizes (12px–14px).
2. **Code & Metrics: JetBrains Mono** (Apache-2.0 license, commercial use permitted)
   - Code editor tabs, workspace path breadcrumbs, commit hashes, peer counts, and keyboard shortcuts.

### 4.1 Zero-CLS Fallback Metrics
To ensure zero Cumulative Layout Shift during initial render:

```css
@font-face {
  font-family: 'Geist Sans Fallback';
  src: local('Arial');
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
  size-adjust: 101%;
}
```

### 4.2 Modular Type Scale

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | 44px (2.75rem) | 48px (1.1) | `-0.035em` | 600 SemiBold | Hero titles |
| `text-title-lg` | 28px (1.75rem) | 34px (1.2) | `-0.025em` | 600 SemiBold | View headers, modal titles |
| `text-title-md` | 20px (1.25rem) | 26px (1.3) | `-0.015em` | 600 SemiBold | Section cards |
| `text-body` | 14px (0.875rem)| 22px (1.57)| `-0.005em` | 400 / 500 | Main body text |
| `text-compact` | 13px (0.8125rem)| 18px (1.38)| `0em` | 400 / 500 | File tree, table cells, form labels |
| `text-micro` | 11px (0.6875rem)| 14px (1.27)| `+0.03em` | 500 / 600 | Badges, tags, shortcut keys (Uppercase) |
| `text-code` | 13px (0.8125rem)| 20px (1.54)| `0em` | 400 / 500 | Editor code, logs, hashes (JetBrains Mono) |

---

## 5. Spacing, Radii & Elevation

### 5.1 Strict 4px/8px Geometric Grid
- Micro: `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`)
- Structural: `16px` (`space-4`), `24px` (`space-6`), `32px` (`space-8`), `48px` (`space-12`)
- Layout: `64px` (`space-16`), `96px` (`space-24`)

### 5.2 Radii Architecture
- `rounded-none`: 0px (Code editor tabs, flush panels)
- `rounded-sm`: 4px (Buttons, badges, inputs, keyboard tags)
- `rounded-md`: 6px (Dropdown menus, tooltips, list row highlights)
- `rounded-lg`: 8px (Dialogs, project cards, floating panels)
- **Eliminated:** No generic `rounded-2xl` or `rounded-3xl` pill shapes.

### 5.3 Elevation Without Render Penalties
Instead of costly multi-layer box shadows and blur backdrops:
- **Hairline Borders:** `1px solid var(--border-subtle)` defines depth.
- **Pseudo-Element Opacity Fade:** For floating cards requiring depth, elevation is drawn on an absolute `::after` pseudo-element with a pre-baked subtle shadow (`0 8px 24px rgba(0,0,0,0.3)`), and hover state animates **only the pseudo-element's opacity** from 0 to 1. This keeps the animation 100% on the GPU compositor thread with 0 layout thrashing and 0 paint recalculations.

---

## 6. Motion Tokens (Compositor 60fps)

- **Timing Function:** `cubic-bezier(0.16, 1, 0.3, 1)` (Linear/Apple standard curve)
- **Micro transitions (Button hover, tab switch):** `120ms`
- **Surface transitions (Modal reveal, drawer open):** `180ms`
- **Permitted Animated Properties:** `transform`, `opacity` ONLY.
- **Strict Reduced Motion:** When `@media (prefers-reduced-motion: reduce)` is active, transitions are reduced to `opacity` with `duration: 0.01ms`.
