/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          canvas: 'var(--surface-canvas)',
          subtle: 'var(--surface-subtle)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          active: 'var(--surface-active)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          default: 'var(--border-default)',
          hover: 'var(--border-hover)',
          focus: 'var(--border-focus)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          'on-accent': 'var(--text-on-accent)',
        },
        accent: {
          DEFAULT: 'var(--accent-base)',
          base: 'var(--accent-base)',
          hover: 'var(--accent-hover)',
          active: 'var(--accent-active)',
          subtle: 'var(--accent-subtle)',
          border: 'var(--accent-border)',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
          info: 'var(--status-info)',
        },
        // 8 distinct, accessible collaborator colors for cursors & presence
        peer: {
          1: '#10b981', // Emerald
          2: '#0ea5e9', // Sky
          3: '#f59e0b', // Amber
          4: '#f43f5e', // Rose
          5: '#8b5cf6', // Violet
          6: '#06b6d4', // Cyan
          7: '#f97316', // Orange
          8: '#14b8a6', // Teal
        },
        editor: {
          bg: 'var(--surface-canvas)',
          sidebar: 'var(--surface-subtle)',
          border: 'var(--border-subtle)',
          active: 'var(--surface-raised)',
          text: 'var(--text-secondary)',
        }
      },
      fontFamily: {
        sans: ['Geist Sans', 'Geist Sans Fallback', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '6px',
        md: '10px',
        lg: '16px',
        full: '9999px',
      },
      boxShadow: {
        'soft-sm': 'var(--shadow-sm)',
        'soft-md': 'var(--shadow-md)',
        'soft-lg': 'var(--shadow-lg)',
        'soft-overlay': 'var(--shadow-overlay)',
      },
      transitionTimingFunction: {
        workbench: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '220ms',
        slow: '300ms',
      }
    },
  },
  plugins: [],
}
