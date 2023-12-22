export type SplitMatchElement = {
  value: string;
  isMatch: boolean;
};

export type SplitMatchArray = SplitMatchElement[];

export const splitMatches = (haystack: string, re: RegExp): SplitMatchArray => {
  const matchMetadata = [...haystack.matchAll(new RegExp(re.source, `g`))].map(
    (match) => {
      return {
        startIndex: match.index,
        length: match[0].length,
      };
    }
  );

  if (matchMetadata.length === 0) {
    return [];
  }

  const result: SplitMatchArray = [];
  let substringStart = 0;

  for (const match of matchMetadata) {
    if (substringStart < match.startIndex) {
      result.push({
        value: haystack.substring(substringStart, match.startIndex),
        isMatch: false,
      });
      substringStart = match.startIndex;
    }

    if (substringStart >= match.startIndex) {
      result.push({
        value: haystack.substring(
          substringStart,
          match.startIndex + match.length
        ),
        isMatch: true,
      });
      substringStart = match.startIndex + match.length;
    }
  }

  const lastMatch = matchMetadata[matchMetadata.length - 1];
  if (lastMatch.startIndex + lastMatch.length < haystack.length) {
    result.push({
      value: haystack.substring(lastMatch.startIndex + lastMatch.length),
      isMatch: false,
    });
  }

  return result;
};

// const propertyDescriptors = (Object.getOwnPropertyNames(currentMatch).map((propName) => {
//   return propName + ": " + JSON.stringify(currentMatch[propName])
// }).join(", "));
// console.log(`propertyDescriptors`, propertyDescriptors);
