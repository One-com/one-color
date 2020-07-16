module.exports = {
  // entry: 'index.js',

  plugins: [
    require('@rollup/plugin-commonjs')(),
    require('rollup-plugin-terser').terser(),
  ],

  output: {
    format: 'umd',
    name: 'one.color',
    sourcemap: true,
  },
};
