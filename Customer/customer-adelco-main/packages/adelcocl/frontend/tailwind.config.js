const {
  theme,
  plugins
} = require('@adelco/web-components/dist/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './frontastic/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
    './node_modules/@adelco/web-components/src/**/*.{js,jsx,ts,tsx}'
  ],
  theme,
  plugins
};
