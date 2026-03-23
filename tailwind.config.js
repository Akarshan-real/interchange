/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../popup.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        bit: ["Bitcount", "sans-serif"],
        comic: ["Comic", "sans-serif"],
      },
    },
  },
  plugins: [],
}

