import type { Config } from 'tailwindcss';

/**
 * BUSINESS-HUB COMPUTERS design tokens.
 * Palette is drawn directly from the logo: deep navy wordmark,
 * scarlet accent mark, white field.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1B4D',        // deepest navy, headlines and footer
        brand: {
          DEFAULT: '#17359B',  // primary blue, buttons and links
          soft: '#2A50C8',     // hover / lighter blue
          tint: '#EDF1FC',     // pale blue fill
          line: '#C7D2F0'
        },
        scarlet: {
          DEFAULT: '#D6202A',  // accent: sale, alerts, calls to action
          soft: '#E8434C',
          tint: '#FDECEC'
        },
        mist: '#F4F6FB',       // page background
        line: '#E2E7F1',       // hairline borders
        slate: {
          DEFAULT: '#5A6784',  // secondary text
          deep: '#38425C'
        },
        success: '#0E7A4B',
        warning: '#B4690E'
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif']
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }]
      },
      borderRadius: {
        card: '0.625rem',
        pill: '999px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 27, 77, 0.06), 0 8px 24px -12px rgba(10, 27, 77, 0.18)',
        lift: '0 12px 32px -14px rgba(10, 27, 77, 0.34)',
        bar: '0 1px 0 rgba(10, 27, 77, 0.08)'
      },
      maxWidth: {
        shell: '82.5rem'
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
      }
    }
  },
  plugins: []
};

export default config;
