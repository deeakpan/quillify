/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37', // Gold
          dark: '#b38f2e',
          light: '#e5c158',
        },
        secondary: {
          DEFAULT: '#6b46c1', // Purple
          dark: '#553c9a',
          light: '#9f7aea',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-merriweather)'],
      },
    },
  },
  plugins: [],
} 