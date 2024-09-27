/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'selector',
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Helvetica', 'Helvetica Neue', 'Roboto', 'Arial', 'sans-serif'],
      mono: ['Iosevka Nerd Font', 'Roboto Mono', 'ZedMono Nerd Font', 'SF Mono', 'monospace']
    }
  },
  plugins: [],
}

