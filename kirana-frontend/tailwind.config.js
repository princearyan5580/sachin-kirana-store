/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jamboGreen: '#0284c7', // Professional wholesale look
        jamboDark: '#0f172a',
      }
    },
  },
  plugins: [],
}