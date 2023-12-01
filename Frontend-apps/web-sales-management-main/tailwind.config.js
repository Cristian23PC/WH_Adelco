const {
  theme,
  plugins
} = require('@adelco/web-components/dist/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@adelco/web-components/src/**/*.{js,jsx,ts,tsx}'
  ],
  theme,
  plugins
};
