import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const plugins = () => [
  resolve({
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
  }),
];

export default [
  {
    input: 'tscbuild/index.js',
    output: {
      format: 'esm',
      file: 'dist/index.js',
      name: 'index',
      sourcemap: true,
    },
    external: ["glob", "jquery", "jsdom", "lodash", "prettier", "seedrandom"],
    plugins: plugins(),
  },
];
