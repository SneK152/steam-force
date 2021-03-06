const colors = require("tailwindcss/colors")
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "540px",
      },
      colors: {
        gray: colors.gray,
        black: "#2a2b2e",
        blue: {
          DEFAULT: "#67ADF3",
        },
        green: {
          DEFAULT: "#5BD7A3",
        },
        red: {
          DEFAULT: "#D54852",
        },
        other: colors.neutral,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
