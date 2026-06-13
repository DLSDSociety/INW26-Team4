/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary = Deep Indigo, RESERVED for final actions (Add to Cart / Checkout)
        primary:        '#15157d',
        'primary-hover':'#2e3192',

        // Charcoal = default primary button, headings, body text
        charcoal:       '#191c1d',
        'charcoal-soft':'#2e3132',

        // Neutrals
        surface:        '#f8f9fa',  // page background
        'surface-2':    '#f3f4f5',  // section differentiation
        'surface-3':    '#edeeef',  // cards on surface
        'on-surface':   '#191c1d',  // body text
        'on-surface-2': '#464652',  // secondary text
        outline:        '#c7c5d4',  // input borders
        'outline-soft': '#e2e8f0',  // dividers

        // Accents
        ecru:           '#f5efe6',
        terracotta:     '#c5613a',
      },
      borderRadius: {
        // "Soft-square" — the signature radius of the system
        soft: '10px',
      },
      letterSpacing: {
        display: '-0.04em',
        tight:   '-0.02em',
        label:   '0.05em',  // all-caps editorial labels
      },
      fontSize: {
        // Editorial display scale
        'display-lg':       ['64px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-md':       ['40px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '600' }],
        'headline-md':      ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '500' }],
        'headline-sm':      ['24px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
      },
      boxShadow: {
        // Diffused ambient shadow — never muddy
        ambient: '0 8px 32px rgba(25, 28, 29, 0.04)',
        lift:    '0 12px 40px rgba(25, 28, 29, 0.08)',
      },
      maxWidth: {
        container: '1440px',
      },
      spacing: {
        'gutter':         '24px',
        'margin-desktop': '64px',
      },
    },
  },
  plugins: [],
};