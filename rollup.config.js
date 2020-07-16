module.exports = {
  // entry: 'index.js',
  format: 'umd',
  moduleName: 'one.color',

  sourceMap: true,

  plugins: [
    require('rollup-plugin-commonjs')(),
    require('rollup-plugin-terser').terser(),
  ],
};
