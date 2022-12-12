/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'orange': '#FBB04B',
      'peach': '#F5D7AE',
      'beige': '#FEFBF1',
      'grey': '#8C8C8C',
      'dark-grey': '#333333'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        mont: ['"Montserrat"', ...defaultTheme.fontFamily.sans],
        roboto: ['"Roboto"']
      }
    },
  },
  plugins: [],
}
