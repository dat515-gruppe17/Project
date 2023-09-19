/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-purple': '#ccf',
        'custom-green': '#cfc',
        'custom-blue': 'rgb(172, 211, 237)',
      },
      fontFamily: {
        'Reenie': ['Reenie Beanie'],
        'primary': ['Poppins'],
      },
    },
  },

  
  plugins: [],
}

