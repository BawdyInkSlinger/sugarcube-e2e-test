export {};

const isCached =
  require.cache[
    require.resolve('jsdom/lib/jsdom/living/helpers/strings.js')
  ];
  
if (isCached) {
  throw new Error(
    `'node_modules/jsdom/lib/jsdom/living/helpers/strings.js' is already cached so it can not be monkey patched. Run this before importing JSDOM: import './test-api/internal/monkey-patching/jsdom/strings'`
  );
}
