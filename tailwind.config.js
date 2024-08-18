/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'selector',
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Helvetica Neue', 'Fira Sans'],
      mono: ['Iosevka Nerd Font', 'Roboto Mono', 'ZedMono Nerd Font']
    }
  },
  plugins: [],
}

