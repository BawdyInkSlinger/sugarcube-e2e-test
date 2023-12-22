import { splitMatches } from './split-matches';

describe(`splitMatches`, () => {
  it('returns an empty array if there are no matches', async () => {
    expect(splitMatches(`foo bar baz`, /qux/)).toEqual([]);
  });

  it('returns a single match if haystack and regex are equivalent', async () => {
    expect(splitMatches(`foo bar baz`, /foo bar baz/)).toEqual([
      {
        value: `foo bar baz`,
        isMatch: true,
      },
    ]);
  });

  it('returns a match and non-match when regex matches beginning of haystack', async () => {
    expect(splitMatches(`foo bar baz`, /foo bar /)).toEqual([
      {
        value: `foo bar `,
        isMatch: true,
      },
      {
        value: `baz`,
        isMatch: false,
      },
    ]);
  });

  it('returns a non-match and match when regex matches end of haystack', async () => {
    expect(splitMatches(`foo bar baz`, /baz/)).toEqual([
      {
        value: `foo bar `,
        isMatch: false,
      },
      {
        value: `baz`,
        isMatch: true,
      },
    ]);
  });

  // multiple matches
  // regex has groups?
});
