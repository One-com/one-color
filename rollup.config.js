var commonjs = require('rollup-plugin-commonjs');

module.exports = {
  // entry: 'index.js',
  format: 'umd',
  moduleName: 'one.color',
  dest: 'OUT.js',

  sourceMap: true,

  plugins: [commonjs()],
};
