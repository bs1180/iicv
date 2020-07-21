const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
    customForms: (theme) => ({
      default: {
        input: {
          borderRadius: theme("borderRadius.default"),
        },
      },
    }),
  },
  variants: {},
  plugins: [require("@tailwindcss/ui")],
};
