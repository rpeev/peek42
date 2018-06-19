import pkg from './package.json';

const config = [{
  input: './src/peek42.js',
  output: {
    format: 'es',
    file: pkg.module
  }
}, {
  input: './src/peek42.node.js',
  output: {
    format: 'cjs',
    file: pkg.main,
    exports: 'named'
  }
}, {
  input: './src/peek42.js',
  output: {
    format: 'umd',
    file: pkg.browser,
    exports: 'named',
    name: 'peek42'
  }
}];

export default config;
