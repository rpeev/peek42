import copy from 'rollup-plugin-copy';
import html from 'rollup-plugin-html';
import sass from 'rollup-plugin-sass';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const pluginCopy = copy({
  'src/browser/assets/monofur.woff': 'dist/monofur.woff',
  'src/browser/console/styles/peek42-dark.css': 'dist/peek42-dark.css',
  'src/browser/peek42.bookmarklet.unpkg.js': 'dist/peek42.bookmarklet.unpkg.js'
});
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
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread'
  ]
});

const config = [{
  external: ['events'],
  input: './src/index.node.js',
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
  input: './src/index.browser.js',
  output: {
    format: 'umd',
    file: pkg.browser,
    name: pkg.name,
    sourcemap: true
  },
  plugins: [
    pluginCopy,
    pluginHtml,
    pluginSass,
    pluginJson,
    pluginBabel
  ],
  watch: {
    include: 'src/**'
  }
}, {
  external: ['events'],
  input: './src/index.node.mjs',
  output: {
    format: 'es',
    file: pkg.main_module,
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
  input: './src/index.browser.mjs',
  output: {
    format: 'es',
    file: pkg.module,
    sourcemap: true
  },
  plugins: [
    pluginCopy,
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
