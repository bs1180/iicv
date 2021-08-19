const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
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
          "&:focus": {
            borderColor: theme("colors.blue[400]"),
          },
        },
      },
    }),
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
};
