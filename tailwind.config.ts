import type { Config } from 'tailwindcss';

/**
 * Palet warisan budaya Komering (bespoke heritage palette):
 * kayu  — latar marun gelap / kayu obsidian (#140706 – #240B09)
 * emas  — emas songket kerajaan (#D4AF37, #E5C158)
 * gading — teks utama (#FDFBF7), pasir — teks pudar (#A89070)
 * Dimuat oleh app/globals.css lewat direktif @config (Tailwind v4).
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        kayu: {
          950: '#140706',
          900: '#1A0908',
          800: '#240B09',
          700: '#2D100E',
          600: '#3D1612',
          500: '#5C1E1A',
        },
        marun: {
          600: '#6E1B1F',
          500: '#8E2429',
          400: '#B23A3A',
        },
        emas: {
          DEFAULT: '#D4AF37',
          200: '#F6E7B4',
          300: '#EED68A',
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B08E2A',
          700: '#7E6420',
        },
        gading: '#FDFBF7',
        pasir: '#A89070',
        daun: '#8FB58A',
        terakota: '#D98B66',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        songket: 'var(--pola-songket)',
        tumpal: 'var(--pola-tumpal)',
      },
    },
  },
};

export default config;
