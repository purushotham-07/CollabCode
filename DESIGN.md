# DESIGN SYSTEM: Calm, Precise Developer Tool

CollabCode's design system is engineered for developers who spend hours in code. It draws inspiration from the disciplined visual restraint of Linear, the optical clarity of Vercel, the real-time presence cues of Liveblocks, and the dense ergonomics of Zed.

---

## 1. Core Principles

1. **Quiet Authority**: An interface that recedes into the background so the code and real-time team presence remain the hero.
2. **Layered Elevation Without Pure Black**: The canvas is a soft slate-obsidian (`oklch(0.14 ...)`), avoiding harsh pure `#000` contrasts while establishing 4 distinct elevation tiers.
3. **One Signal Accent**: A surgical, high-energy Emerald (`oklch(0.72 0.17 155)`) reserved exclusively for primary actions, active connection states, and live CRDT convergence.
4. **Accessible Collaborator Palette**: Exactly 8 distinct, high-contrast colors dedicated to remote cursors and presence avatars, ensuring instant visual differentiation without color clashes.
5. **Compositor-Only Motion**: Animations strictly limited to `transform` and `opacity` between 150ms and 250ms with a `cubic-bezier(0.16, 1, 0.3, 1)` deceleration curve. Full reduced-motion fallback.

---

## 2. Color System (OKLCH)

### 2.1 Dark Theme (Default)
```css
:root, .dark {
  /* Slate Canvas & Layered Elevation (Not #000) */
  --surface-canvas:  oklch(0.14 0.008 260); /* Base window background */
  --surface-subtle:  oklch(0.17 0.010 260); /* File tree, tab rails, sticky nav */
  --surface-raised:  oklch(0.20 0.012 260); /* Cards, input containers, panels */
  --surface-overlay: oklch(0.24 0.014 260); /* Modals, dropdowns, command palette */
  --surface-active:  oklch(0.28 0.016 260); /* Pressed states, active tab highlights */

  /* Hairline Architectural Borders */
  --border-subtle:  oklch(0.26 0.010 260 / 0.7); /* Subtle panel dividers */
  --border-default: oklch(0.32 0.012 260);       /* Cards, inputs, structural edges */
  --border-hover:   oklch(0.44 0.016 260);       /* Interactive hover boundaries */
  --border-focus:   oklch(0.72 0.17 155);        /* High-contrast focus rings */

  /* Typography Scale (WCAG AAA & AA Certified) */
  --text-primary:   oklch(0.97 0.004 260); /* 14.8:1 contrast on canvas (AAA) */
  --text-secondary: oklch(0.76 0.010 260); /* 7.8:1 contrast on canvas (AAA) */
  --text-muted:     oklch(0.58 0.014 260); /* 4.6:1 contrast on canvas (AA) */
  --text-on-accent: oklch(0.12 0.008 260); /* High-contrast text on solid accent (AAA) */

  /* Signal Accent: Precision Emerald */
  --accent-base:    oklch(0.72 0.17 155);
  --accent-hover:   oklch(0.78 0.18 155);
  --accent-active:  oklch(0.66 0.16 155);
  --accent-subtle:  oklch(0.22 0.05 155);
  --accent-border:  oklch(0.38 0.10 155);

  /* Semantic Feedback Tokens */
  --status-success: oklch(0.72 0.17 155);
  --status-warning: oklch(0.78 0.16 75);
  --status-danger:  oklch(0.65 0.22 25);
  --status-info:    oklch(0.72 0.14 235);
}
```

### 2.2 Light Theme (System-Aware & Toggleable)
```css
.light {
  --surface-canvas:  oklch(0.985 0.004 260);
  --surface-subtle:  oklch(0.960 0.006 260);
  --surface-raised:  oklch(1.000 0.000 0);
  --surface-overlay: oklch(0.940 0.008 260);
  --surface-active:  oklch(0.910 0.010 260);

  --border-subtle:  oklch(0.880 0.006 260 / 0.8);
  --border-default: oklch(0.820 0.010 260);
  --border-hover:   oklch(0.650 0.014 260);
  --border-focus:   oklch(0.550 0.16 155);

  --text-primary:   oklch(0.16 0.012 260);
  --text-secondary: oklch(0.38 0.014 260);
  --text-muted:     oklch(0.52 0.012 260);
  --text-on-accent: oklch(0.99 0.002 260);

  --accent-base:    oklch(0.55 0.16 155);
  --accent-hover:   oklch(0.48 0.16 155);
  --accent-active:  oklch(0.42 0.15 155);
  --accent-subtle:  oklch(0.92 0.04 155);
  --accent-border:  oklch(0.78 0.08 155);
}
```

### 2.3 8-Color Collaborator Palette
Dedicated to remote cursors, carets, selection highlights, and presence badges:

| Name | Hex / OKLCH | Foreground Text | Usage |
| :--- | :--- | :--- | :--- |
| **Emerald** | `#10b981` / `oklch(0.72 0.17 155)` | `#0d1117` | User 1 (Default / Host) |
| **Sky** | `#0ea5e9` / `oklch(0.70 0.16 230)` | `#0d1117` | User 2 |
| **Amber** | `#f59e0b` / `oklch(0.76 0.16 75)` | `#0d1117` | User 3 |
| **Rose** | `#f43f5e` / `oklch(0.67 0.22 15)` | `#ffffff` | User 4 |
| **Violet** | `#8b5cf6` / `oklch(0.65 0.20 290)` | `#ffffff` | User 5 |
| **Cyan** | `#06b6d4` / `oklch(0.74 0.14 200)` | `#0d1117` | User 6 |
| **Orange** | `#f97316` / `oklch(0.71 0.19 45)` | `#ffffff` | User 7 |
| **Teal** | `#14b8a6` / `oklch(0.72 0.15 175)` | `#0d1117` | User 8 |

---

## 3. Typography Hierarchy

- **UI Font**: Geist Sans (self-hosted WOFF2 via `@fontsource/geist-sans`)
- **Code & Technical Font**: JetBrains Mono (self-hosted WOFF2 via `@fontsource/jetbrains-mono`)
- **Reading Length**: Max 65 characters (`max-w-prose` / `max-w-2xl`) for comfortable body readability.
- **Rule**: Mono is strictly reserved for code lines, editor tabs, keyboard shortcuts, file paths, and latency/diff numbers. All UI navigation, headings, body text, and buttons use Geist Sans.

| Scale Token | Font Size | Line Height | Letter Spacing | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | 48px (3.0rem) | 52px (1.08) | `-0.035em` | 600 SemiBold | Hero headline |
| `text-h1` | 32px (2.0rem) | 38px (1.18) | `-0.025em` | 600 SemiBold | Section headings, view titles |
| `text-h2` | 24px (1.5rem) | 30px (1.25) | `-0.020em` | 600 SemiBold | Feature card headers, modal titles |
| `text-h3` | 18px (1.125rem)| 24px (1.33) | `-0.010em` | 600 SemiBold | Subsection titles |
| `text-body` | 15px (0.9375rem)| 24px (1.60) | `-0.005em` | 400 Regular | Primary reading body copy |
| `text-compact`| 13px (0.8125rem)| 20px (1.53) | `0em` | 400 / 500 | Forms, file tree items, buttons |
| `text-mono-sm`| 12px (0.75rem) | 18px (1.50) | `0em` | 400 Mono | Code tabs, terminal logs |
| `text-micro` | 11px (0.6875rem)| 14px (1.27) | `+0.04em` | 500 SemiBold | Badges, Kbd shortcuts (Caps) |

---

## 4. Spacing, Radii & Soft Elevation

### 4.1 4/8px Rhythmic Scale
- Micro: `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`)
- Elements: `16px` (`space-4`), `20px` (`space-5`), `24px` (`space-6`)
- Sections: `32px` (`space-8`), `48px` (`space-12`), `64px` (`space-16`), `80px` (`space-20`)

### 4.2 Radii Scale
- `rounded-sm`: `6px` (Buttons, inputs, badges, shortcuts)
- `rounded-md`: `10px` (Dropdown menus, tooltips, project cards, dialog inner panels)
- `rounded-lg`: `16px` (Modals, hero product mockup, floating command palette)

### 4.3 Soft Layered Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
--shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.35), 0 2px 6px -1px rgba(0, 0, 0, 0.25);
--shadow-lg: 0 12px 28px -4px rgba(0, 0, 0, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.30);
--shadow-overlay: 0 24px 48px -8px rgba(0, 0, 0, 0.55), 0 8px 16px -4px rgba(0, 0, 0, 0.35);
```

---

## 5. Component Library Specifications

1. **Button**:
   - `primary`: Filled accent background (`var(--accent-base)`), high-contrast text (`var(--text-on-accent)`), subtle hover brightness, active scale `0.99`.
   - `secondary`: Surface raised with `1px solid var(--border-default)`, text primary, hover overlay background.
   - `ghost`: Transparent background, hover surface raised, text secondary.
   - `danger`: Dark red surface with red border and red text (`var(--status-danger)`).
2. **Input & Select**:
   - Surface canvas background, `1px solid var(--border-default)`, `rounded-sm`, 13px text, visible emerald focus ring with `outline: 2px solid var(--accent-base)`.
3. **Tabs**:
   - Clean horizontal rail with subtle indicator bar, smooth 150ms opacity/color transition.
4. **Dialog & Dropdown**:
   - Accessible modal dialogs with focus trap, backdrop dimming, `rounded-lg`, and soft overlay shadows.
5. **Toast**:
   - Non-blocking bottom-right notifications with status iconography (success, error, info) and auto-dismissal.
6. **Avatar & AvatarStack**:
   - Circular or rounded-sm indicators with border ring and remote collaborator palette assignments.
7. **Badge & Kbd**:
   - Compact status pills and keyboard shortcut tags with tactile key borders.
8. **Skeleton**:
   - Low-contrast pulse placeholder for loading states preventing content pop-in.
9. **EmptyState**:
   - Purposeful iconography, friendly headline, guidance copy, and direct action button.
10. **Command Palette (`Ctrl+K` / `Cmd+K`)**:
    - Instant keyboard-driven workspace navigation, file switching, and quick actions.
