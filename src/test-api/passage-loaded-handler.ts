export type PassageLoadedHandler = (debugNote: string) => Promise<void>;
let passageLoadedHandler: (debugNote: string) => Promise<void>;

export const getPassageLoadedHandler = (): PassageLoadedHandler => {
  return passageLoadedHandler;
};

export const setPassageLoadedHandler = (handler: PassageLoadedHandler) => {
  passageLoadedHandler = handler;
};
