/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Theme
        cyber: {
          black: '#0a0a0f',
          dark: '#121218',
          darker: '#1a1a24',
          gray: '#2a2a35',
          light: '#3a3a45',
          border: '#404050',
        },
        neon: {
          green: '#00ff41',
          blue: '#00d4ff',
          purple: '#b744ff',
          pink: '#ff0080',
          orange: '#ff6600',
          yellow: '#ffff00',
        },
        matrix: {
          green: '#00ff41',
          'green-dark': '#00cc33',
          'green-light': '#66ff80',
        },
        primary: {
          50: '#eff6ff',
          500: '#00d4ff',
          600: '#00b8e6',
          700: '#009acc',
        },
        success: {
          500: '#00ff41',
        },
        warning: {
          500: '#ff6600',
        },
        danger: {
          500: '#ff0080',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'terminal': 'terminal 1s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'status-online': 'status-online 2s ease-in-out infinite',
        'status-warning': 'status-warning 1.5s ease-in-out infinite',
        'status-error': 'status-error 1s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
        'scan-sweep': 'scan-sweep 3s ease-in-out infinite',
        'topology-scan': 'topology-scan 2s ease-in-out infinite',
        'loading-bars': 'loading-bars 1.4s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'enhanced-pulse': 'enhanced-pulse 2s ease-in-out infinite',
        'data-flow': 'data-flow 2s ease-in-out infinite',
        'chart-draw': 'chart-draw 1.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': { 
            textShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor',
          },
        },
        'glow': {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'terminal': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'data-flow': {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0',
          },
        },
        'chart-draw': {
          '0%': {
            strokeDasharray: '1000',
            strokeDashoffset: '1000',
          },
          '100%': {
            strokeDasharray: '1000',
            strokeDashoffset: '0',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scan-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'scan-sweep': {
          '0%': { transform: 'translateX(-100%) skewX(-20deg)' },
          '100%': { transform: 'translateX(100%) skewX(-20deg)' },
        },
        'topology-scan': {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: '0.5',
          },
          '50%': { 
            transform: 'scale(1.1)',
            opacity: '1',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '0.8',
          },
        },
        'loading-bars': {
          '0%, 40%, 100%': { 
            transform: 'scaleY(0.4)',
            opacity: '0.5',
          },
          '20%': { 
            transform: 'scaleY(1)',
            opacity: '1',
          },
        },
        'wave': {
          '0%, 60%, 100%': {
            transform: 'initial',
            opacity: '0.4',
          },
          '30%': {
            transform: 'translateY(-8px)',
            opacity: '1',
          },
        },
        'enhanced-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.05)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}