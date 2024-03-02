import { setupJsdom } from './setup-jsdom';
import { createContext as createGlobalContext, isContext, runInNewContext } from 'node:vm';

const domPropertyNames = [
  'HTMLElement',
  'NodeList',
  'HTMLDivElement',
  'Element',
];

describe(`setupJsdom`, () => {
  describe(`window`, () => {
    let globalContext;
    beforeEach(() => {
      globalContext = createGlobalContext({ setupJsdom, console });
      globalContext.global = globalContext;
      console.log(`beforeEach.isContext`, isContext(globalContext));
    });

    it(`includes DOM objects in globalThis when called with default options`, async () => {
      runInNewContext(`setupJsdom('');`, globalContext);

      domPropertyNames.forEach((propertyName) => {
        expect(globalContext[propertyName])
          .withContext(propertyName)
          .toBeDefined();
        expect(globalContext[propertyName])
          .withContext(propertyName)
          .not.toBeNull();
      });
    });

    it('includes DOM objects in globalThis when called with "runScripts": "dangerously" options', async () => {
      runInNewContext(
        `setupJsdom('', { url: 'http://localhost', runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, });`,
        globalContext
      );

      console.log(`globalContext`, globalContext);

      domPropertyNames.forEach((propertyName) => {
        expect(globalContext[propertyName])
          .withContext(propertyName)
          .toBeDefined();
        expect(globalContext[propertyName])
          .withContext(propertyName)
          .not.toBeNull();
      });
    });
  });
});
