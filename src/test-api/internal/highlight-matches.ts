import { SplitMatchArray } from './split-matches';

export const highlightMatches = (
  matches: SplitMatchArray,
  highlightFunction: (input: string) => string
): string => {
  return matches
    .map(({ value, isMatch }) => {
      return isMatch ? highlightFunction(value) : value;
    })
    .join('');
};
