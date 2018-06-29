import html from 'rollup-plugin-html';
import sass from 'rollup-plugin-sass';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const pluginHtml = html({
  
});
const pluginSass = sass({
  output: `dist/${pkg.name}.css`
});
const pluginJson = json({
  preferConst: true
});
const pluginBabel = babel({
  exclude: 'node_modules/**',
  plugins: [
    'transform-class-properties'
  ]
});

const config = [{
  input: './src/peek42.node.js',
  output: {
    format: 'cjs',
    file: pkg.main,
    sourcemap: true
  },
  plugins: [
    pluginJson,
    pluginBabel
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
    pluginHtml,
    pluginSass,
    pluginJson,
    pluginBabel
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
    pluginHtml,
    pluginSass,
    pluginJson,
    pluginBabel
  ],
  watch: {
    include: 'src/**'
  }
}];

export default config;
