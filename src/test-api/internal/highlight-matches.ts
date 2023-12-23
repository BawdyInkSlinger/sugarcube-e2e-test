import { SplitMatchArray } from './split-matches';

export const highlightMatches = (matches: SplitMatchArray): string => {
  return matches
    .map((match) => {
      return match.value;
    })
    .join('');
};
