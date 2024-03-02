import vm from 'node:vm';

describe(`node:vm`, () => {
  it(`can use the global keyword`, () => {
    const context = {} as any;
    context.global = context;

    vm.runInNewContext('global.foo=5;', context);

    expect(context.foo).toEqual(5);
  });

  it('calls outer local functions in outer context', () => {
    const context = { setGlobalVar } as any;
    context.global = context;

    vm.runInNewContext(`setGlobalVar('foo', 5);`, context);

    expect(context.foo).toBeUndefined();
    expect(globalThis.foo).toEqual(5);
  });

  it('calls inner local functions in inner context', () => {
    const context = { } as any;
    context.global = context;

    vm.runInNewContext(`${innerSetGlobalVar} setGlobalVar('foo', 5);`, context);

    expect(context.foo).toEqual(5);
    expect(globalThis.foo).toBeUndefined();
  });

  function setGlobalVar(
    propertyName: string,
    propertyValue: unknown
  ): void {
    globalThis[propertyName] = propertyValue;
  }

  const innerSetGlobalVar = `
  function setGlobalVar(propertyName, propertyValue) {
    globalThis[propertyName] = propertyValue;
  }`;
});
