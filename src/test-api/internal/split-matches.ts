export type SplitMatchElement = {
  value: string;
  isMatch: boolean;
};

export type SplitMatchArray = SplitMatchElement[];

export const splitMatches = (haystack: string, re: RegExp): SplitMatchArray => {
  const result: SplitMatchArray = [];
  let substringStart = 0;
  [...haystack.matchAll(new RegExp(re.source, `g`))]
    .map((match) => {
      return {
        matchStartIndex: match.index,
        matchLength: match[0].length,
      };
    })
    .forEach((match) => {
      if (substringStart < match.matchStartIndex) {
        result.push({
          value: haystack.substring(substringStart, match.matchStartIndex),
          isMatch: false,
        });
        substringStart = match.matchStartIndex;
      }

      if (substringStart >= match.matchStartIndex) {
        result.push({
          value: haystack.substring(
            substringStart,
            match.matchStartIndex + match.matchLength
          ),
          isMatch: true,
        });
        substringStart = match.matchStartIndex + match.matchLength;
      }
    });

  if (result.length > 0 && substringStart < haystack.length - 1) {
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
