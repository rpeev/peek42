import json from 'rollup-plugin-json';

import pkg from './package.json';

const pluginJson = json({
  preferConst: true
});

const config = [{
  input: './src/peek42.node.js',
  output: {
    format: 'cjs',
    file: pkg.main,
    sourcemap: true
  },
  plugins: [
    pluginJson
  ],
  watch: {
    include: 'src/**'
  }
}, {
  input: './src/peek42.js',
  output: {
    format: 'umd',
    file: pkg.browser,
    name: pkg.name,
    sourcemap: true
  },
  plugins: [
    pluginJson
  ],
  watch: {
    include: 'src/**'
  }
}, {
  input: './src/peek42.es.js',
  output: {
    format: 'es',
    file: pkg.module,
    sourcemap: true
  },
  plugins: [
    pluginJson
  ],
  watch: {
    include: 'src/**'
  }
}];

export default config;
