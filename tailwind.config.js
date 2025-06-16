/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a'
        },
        trabalho: '#3b82f6',
        'sobreaviso-acionado': '#f59e0b',
        'sobreaviso-nao-acionado': '#8b5cf6',
        success: {
          500: '#10b981'
        },
        error: {
          500: '#ef4444'
        },
        warning: {
          500: '#f59e0b'
        },
        info: {
          500: '#6366f1'
        }
      }
    }
  },
  plugins: []
};
