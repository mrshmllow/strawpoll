const colours = require("./lib/colours/colours")

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [...colours.generate()],
  theme: {
    extend: {},
  },
  plugins: [],
}
