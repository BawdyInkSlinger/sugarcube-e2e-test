import { splitMatches } from './split-matches';
import { highlightMatches } from './highlight-matches';

describe(`highlightMatches`, () => {
  it('returns the original string if there are no matches', async () => {
    expect(highlightMatches(splitMatches(`foo bar baz`, /qux/))).toEqual(
      'foo bar baz'
    );
  });
});
