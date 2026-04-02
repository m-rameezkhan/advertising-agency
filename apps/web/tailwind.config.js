/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fb",
          100: "#edf0f6",
          200: "#d6ddea",
          300: "#b7c4db",
          400: "#8ba0c0",
          500: "#657fa7",
          600: "#4d6488",
          700: "#3b4d6a",
          800: "#273349",
          900: "#172032",
          950: "#0c1220"
        },
        coral: "#ff6b57",
        mint: "#55d6be",
        sun: "#f5c451",
        sky: "#56a7ff"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(6, 14, 30, 0.18)"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
