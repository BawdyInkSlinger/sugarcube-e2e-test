export type SplitMatchElement = {
  value: string;
  isMatch: boolean;
};

export type SplitMatchArray = SplitMatchElement[];

export const splitMatches = (haystack: string, re: RegExp): SplitMatchArray => {
  const result: SplitMatchArray = [];
  const matches = [...haystack.matchAll(new RegExp(re.source, `g`))];
  let previousMatch: RegExpMatchArray;
  matches.forEach((currentMatch, loopNumber) => {
    if (loopNumber === 0 && currentMatch.index > 0) {
      result.push({
        value: haystack.substring(0, currentMatch.index),
        isMatch: false,
      });
    }

    const element = {
      value: currentMatch[0],
      isMatch: true,
    };
    result.push(element);
    previousMatch = currentMatch;
  });

  if (
    previousMatch?.index !== undefined &&
    previousMatch.index + previousMatch[0].length < haystack.length
  ) {
    result.push({
      value: haystack.substring(previousMatch.index + previousMatch[0].length),
      isMatch: false,
    });
  }
  return result;
};

// const propertyDescriptors = (Object.getOwnPropertyNames(currentMatch).map((propName) => {
//   return propName + ": " + JSON.stringify(currentMatch[propName])
// }).join(", "));
// console.log(`propertyDescriptors`, propertyDescriptors);
