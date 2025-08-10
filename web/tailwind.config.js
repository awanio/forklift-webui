/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,html}'],
  theme: {
    extend: {
      colors: {
        // Align with VitePress-like palette
        brand: {
          DEFAULT: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          soft: 'rgba(59, 130, 246, 0.14)'
        },
        vp: {
          bg: 'var(--vp-c-bg)',
          bgSoft: 'var(--vp-c-bg-soft)',
          bgMute: 'var(--vp-c-bg-mute)',
          border: 'var(--vp-c-border)',
          text1: 'var(--vp-c-text-1)',
          text2: 'var(--vp-c-text-2)',
          text3: 'var(--vp-c-text-3)'
        }
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        lg: '10px'
      }
    }
  },
  plugins: []
}
