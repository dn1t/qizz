module.exports = {
  purge: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx', './src/**/*.js', './src/**/*.jsx'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Pretendard"', 'sans-serif'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
