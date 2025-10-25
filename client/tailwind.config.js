/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme
        'primary-light': '#007BFF',
        'secondary-light': '#6C757D',
        'background-light': '#F8F9FA',
        'surface-light': '#FFFFFF',
        'text-primary-light': '#212529',
        'text-secondary-light': '#6C757D',

        // Dark Theme
        'primary-dark': '#4D96FF',
        'secondary-dark': '#8A939B',
        'background-dark': '#121212',
        'surface-dark': '#1E1E1E',
        'text-primary-dark': '#E8EAED',
        'text-secondary-dark': '#B0B3B8',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
