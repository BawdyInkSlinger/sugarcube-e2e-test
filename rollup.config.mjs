import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const plugins = () => [
  json(),
  resolve({}),
  commonjs({
    include: /node_modules/,
  }),
];

export default [
  {
    input: 'tscbuild/index.js',
    output: {
    inlineDynamicImports: true,
      format: 'esm',
      file: 'dist/index.js',
      name: 'index',
      sourcemap: true,
    },
    plugins: plugins(),
  },
];
