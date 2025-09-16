/** @type {import('tailwindcss').Config} */
export default {
 darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: { bg: '#ffffff', text: '#000000' },
        dark: { bg: '#1a1a1a', text: '#ffffff' },
        blue: { bg: '#e0f2ff', text: '#003366' },
        green: { bg: '#e6f7e6', text: '#006600' },
      },
    },
  },
  plugins: [],
}