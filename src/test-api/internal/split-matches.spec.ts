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

  it('returns a non-match, match, and non-match when regex matches middle of haystack', async () => {
    expect(splitMatches(`foo bar baz`, /bar/)).toEqual([
      {
        value: `foo `,
        isMatch: false,
      },
      {
        value: `bar`,
        isMatch: true,
      },
      {
        value: ` baz`,
        isMatch: false,
      },
    ]);
  });

  it('returns a match, non-match, and match when regex matches edges of haystack', async () => {
    expect(splitMatches(`foo bar baz`, /(foo | baz)/)).toEqual([
      {
        value: `foo `,
        isMatch: true,
      },
      {
        value: `bar`,
        isMatch: false,
      },
      {
        value: ` baz`,
        isMatch: true,
      },
    ]);
  });
});
