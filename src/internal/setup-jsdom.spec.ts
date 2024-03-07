import { setupJsdom } from './setup-jsdom';

const domPropertyNames = [
  'HTMLElement',
  'NodeList',
  'HTMLDivElement',
  'Element',
];

describe(`setupJsdom`, () => {
  describe(`window`, () => {
    beforeEach(() => {
      domPropertyNames.forEach((propertyName) => {
        delete global[propertyName];
      });
    });

    it(`includes DOM objects in globalThis when called with default options`, async () => {
      setupJsdom('');

      domPropertyNames.forEach((propertyName) => {
        expect(global[propertyName]).withContext(propertyName).toBeDefined();
        expect(global[propertyName]).withContext(propertyName).not.toBeNull();
      });
    });

    it('includes DOM objects in globalThis when called with "runScripts": "dangerously" options', async () => {
      setupJsdom('', {
        url: 'http://localhost',
        runScripts: 'dangerously',
        resources: 'usable',
        pretendToBeVisual: true,
      });

      domPropertyNames.forEach((propertyName) => {
        expect(global[propertyName]).withContext(propertyName).toBeDefined();
        expect(global[propertyName]).withContext(propertyName).not.toBeNull();
      });
    });
  });
});
