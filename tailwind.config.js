/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: 'Poppins-Regular',
        'poppins-italic': 'Poppins-Italic',
        'poppins-semibold': 'Poppins-SemiBold',
        'poppins-bold': 'Poppins-Bold',
        'poppins-medium': 'Poppins-Medium',
        'poppins-light': 'Poppins-Light',
      },
    },
  },
  plugins: [],
};
