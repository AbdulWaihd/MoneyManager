/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],  // ← this is what was missing
  theme: {
    extend: {
      colors: {
        primary:      "#0057bf",
        background:   "#f9f9ff",
        surface:      "#ffffff",
        "text-dark":  "#111c2d",
        "text-light": "#424754",
        success:      "#2dcc71",
        error:        "#ba1a1a",
        border:       "#c2c6d6",
      },
      fontSize: {
        sm:    '12px',
        base:  '14px',
        md:    '16px',
        lg:    '18px',
        xl:    '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      fontFamily: {
        heading: ['Manrope'],
        body:    ['Inter'],
      },
      spacing: {
        xs:    '4px',
        sm:    '8px',
        md:    '12px',
        lg:    '16px',
        xl:    '24px',
        '2xl': '32px',
      },
      borderRadius: {
        sm:   '4px',
        base: '8px',
        lg:   '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};