/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppi: 'Poppins-Regular',
        'poppi-italic': 'Poppins-Italic',
        'poppi-semibold': 'Poppins-SemiBold',
        'poppi-bold': 'Poppins-Bold',
        'poppi-medium': 'Poppins-Medium',
        'poppi-light': 'Poppins-Light',
      },
    },
  },
  plugins: [],
};
