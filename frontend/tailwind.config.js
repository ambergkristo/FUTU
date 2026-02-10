/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'bg-primary': '#0B1220',
        'bg-secondary': '#0E1628',
        'bg-tertiary': '#1a2332',

        // Accent colors
        'primary': '#00E5FF',
        'secondary': '#EC4899',
        'accent-blue': '#3B82F6',
        'accent-purple': '#8B5CF6',

        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#E2E8F0',
        'text-muted': '#94A3B8',
        'text-dim': '#64748B',

        // Status colors
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
        'info': '#3B82F6',
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 229, 255, 0.5)',
        'glow-secondary': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 229, 255, 0.15)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
