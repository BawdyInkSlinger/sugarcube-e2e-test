export type SplitMatchElement = {
  value: string;
  isMatch: boolean;
};

export type SplitMatchArray = SplitMatchElement[];

export const splitMatches = (haystack: string, re: RegExp): SplitMatchArray => {
  const matches = [...haystack.matchAll(new RegExp(re.source, `g`))];

  if (matches.length === 0) {
    return [];
  }

  const result: SplitMatchArray = [];
  let substringStart = 0;

  for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
    const match = matches[matchIndex];

    if (substringStart < match.index) {
      result.push({
        value: haystack.substring(substringStart, match.index),
        isMatch: false,
      });
      substringStart = match.index;
    }

    if (substringStart >= match.index) {
      result.push({
        value: haystack.substring(
          substringStart,
          match.index + match[0].length
        ),
        isMatch: true,
      });
      substringStart = match.index + match[0].length;
    }
  }

  const lastMatch = matches[matches.length - 1];
  if (lastMatch.index + lastMatch[0].length < haystack.length) {
    result.push({
      value: haystack.substring(lastMatch.index + lastMatch[0].length),
      isMatch: false,
    });
  }

  return result;
};

// const propertyDescriptors = (Object.getOwnPropertyNames(currentMatch).map((propName) => {
//   return propName + ": " + JSON.stringify(currentMatch[propName])
// }).join(", "));
// console.log(`propertyDescriptors`, propertyDescriptors);
