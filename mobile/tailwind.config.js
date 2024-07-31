/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {

    colors: {
      "white": "#ffffff",
      'gray-light': '#4d4d4d',
      'gray-medium': '#1e1e1e',
      'gray-dark': '#111111',
      'black': '#000000',
      "transparent": "transparent",
      "error": "#ff5252",
      "success": "#4caf50",
    },

  },
  plugins: [],
};