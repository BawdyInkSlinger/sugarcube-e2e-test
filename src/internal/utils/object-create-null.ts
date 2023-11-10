export const objectCreateNull = <Obj extends PropertyDescriptorMap>(
  _nullArgument: null,
  obj: Obj
): // prettier-ignore
{
    [Key in keyof Obj]: (
      /* if */ Obj[Key]['get'] extends (...any: unknown[]) => unknown ? 
        /* then return */ ReturnType<Obj[Key]['get']> :
      /* else if */ Obj[Key]['set'] extends (...any: unknown[]) => unknown ? 
        /* then return */ Parameters<Obj[Key]['set']>[0] : 
      /* else */ 
        /* return */ Obj[Key]['value']
    )
  } =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.create(null, obj) as any;

  // the following can provide useful troubleshooting information when uncommented
  /*
const fn = () => 'hi';
const fn2 = (val: string) => {};
const x = objectCreateNull(null, {
  //  ^?
  v: { value: fn },
  v2: { value: 5 },
  v3: {},
  getFn: { get: fn },
  getFn2: { get: fn, set: fn2 },
  setFn2: { set: fn2 },
});

type unknownExtendsUnknown = unknown extends unknown ? true : false;
//   ^?
type undefinedExtendsUnknown = undefined extends unknown ? true : false;
//   ^?
type unknownExtendsUndefined = unknown extends undefined ? true : false;
//   ^?
type yy = ReturnType<typeof fn>;
*/