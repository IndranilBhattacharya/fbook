const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/app/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          200: "#e0e0e0",
        },
        lime: {
          600: "#79bd14",
        },
      },
      fontFamily: {
        sans: ["Comfortaa", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};