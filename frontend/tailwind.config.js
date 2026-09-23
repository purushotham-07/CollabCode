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
        apple: {
          blue: '#0071e3',
          blueHover: '#0077ed',
          dark: '#000000',
          surface: '#121215',
          card: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.08)',
          gray: '#86868b',
          light: '#f5f5f7',
        },
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
          info: 'var(--status-info)',
        },
        peer: {
          1: '#10b981',
          2: '#0ea5e9',
          3: '#f59e0b',
          4: '#f43f5e',
          5: '#8b5cf6',
          6: '#06b6d4',
          7: '#f97316',
          8: '#14b8a6',
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
        sans: ['Geist Sans', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        'soft-sm': 'var(--shadow-sm)',
        'soft-md': 'var(--shadow-md)',
        'soft-lg': 'var(--shadow-lg)',
        'soft-overlay': 'var(--shadow-overlay)',
        'apple-card': '0 8px 30px rgba(0, 0, 0, 0.28)',
        'apple-glow': '0 0 50px -10px rgba(0, 113, 227, 0.3)',
      },
      transitionTimingFunction: {
        workbench: 'cubic-bezier(0.16, 1, 0.3, 1)',
        apple: 'cubic-bezier(0.25, 1, 0.5, 1)',
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
