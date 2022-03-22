const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/app/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Comfortaa", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
