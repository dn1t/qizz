module.exports = {
  purge: ['./src/**/*.html', './src/**/*.ts', './src/**/*.tsx', './src/**/*.js', './src/**/*.jsx'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Pretendard"', 'sans-serif'],
    },
    extend: {
      letterSpacing: {
        evenwider: '.2rem',
        evenevenwider: '.5rem',
        damnwide: '1rem',
      },
    },
  },
  variants: {
    scrollbar: ['dark', 'rounded'],
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
};
