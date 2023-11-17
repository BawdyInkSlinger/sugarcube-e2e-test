/* 
Original: defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T; 
*/

export const objectDefineProperties = <
  O,
  Props extends PropertyDescriptorMap & ThisType<unknown>,
>(
  o: O,
  properties: Props
): // prettier-ignore
O & {
    [Key in keyof Props]: (
      /* if */ Props[Key]['get'] extends (...any: unknown[]) => unknown ? 
        /* then return */ ReturnType<Props[Key]['get']> :
      /* else if */ Props[Key]['set'] extends (...any: unknown[]) => unknown ? 
        /* then return */ Parameters<Props[Key]['set']>[0] : 
      /* else */ 
        /* return */ Props[Key]['value']
    )
  } =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.defineProperties(o, properties) as any;
