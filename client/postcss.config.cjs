// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'), // <- new plugin package for Tailwind v4
    require('autoprefixer'),
  ],
};
