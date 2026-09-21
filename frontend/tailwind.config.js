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
          error: 'var(--status-error)',
          info: 'var(--status-info)',
        },
        // Backward-compatible semantic aliases for workspace editor components
        editor: {
          bg: 'var(--surface-canvas)',
          sidebar: 'var(--surface-subtle)',
          border: 'var(--border-subtle)',
          active: 'var(--surface-raised)',
          text: 'var(--text-secondary)',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: 'var(--accent-base)',
          600: 'var(--accent-hover)',
          700: 'var(--accent-active)',
        }
      },
      fontFamily: {
        sans: ['Geist Sans', 'Geist Sans Fallback', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      transitionTimingFunction: {
        workbench: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '180ms',
      }
    },
  },
  plugins: [],
}
