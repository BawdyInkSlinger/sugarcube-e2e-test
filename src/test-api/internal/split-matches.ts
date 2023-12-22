export type SplitMatchElement = {
  value: string;
  isMatch: boolean;
};

export type SplitMatchArray = SplitMatchElement[];

export const splitMatches = (haystack: string, re: RegExp): SplitMatchArray => {
  const result: SplitMatchArray = [];
  const matchMetadata = [...haystack.matchAll(new RegExp(re.source, `g`))].map(
    (match) => {
      return {
        matchStartIndex: match.index,
        matchLength: match[0].length,
      };
    }
  );

  if (matchMetadata.length === 0) {
    return [];
  }

  let substringStart = 0;
  matchMetadata.forEach(({ matchStartIndex, matchLength }) => {
    if (substringStart < matchStartIndex) {
      result.push({
        value: haystack.substring(substringStart, matchStartIndex),
        isMatch: false,
      });
      substringStart = matchStartIndex;
    }

    if (substringStart >= matchStartIndex) {
      result.push({
        value: haystack.substring(
          substringStart,
          matchStartIndex + matchLength
        ),
        isMatch: true,
      });
      substringStart = matchStartIndex + matchLength;
    }
  });

  if (substringStart < haystack.length - 1) {
    result.push({
      value: haystack.substring(substringStart),
      isMatch: false,
    });
  }

  return result;
};

// const propertyDescriptors = (Object.getOwnPropertyNames(currentMatch).map((propName) => {
//   return propName + ": " + JSON.stringify(currentMatch[propName])
// }).join(", "));
// console.log(`propertyDescriptors`, propertyDescriptors);
