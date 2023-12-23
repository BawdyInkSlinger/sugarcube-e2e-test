import { splitMatches } from './split-matches';
import { highlightMatches } from './highlight-matches';
import chalk from 'chalk';

describe(`highlightMatches`, () => {
  it('returns the original string if there are no matches', async () => {
    expect(
      highlightMatches(splitMatches(`foo bar baz`, /qux/), chalk.bgGreen)
    ).toEqual('foo bar baz');
  });

  it('returns a colored string if the whole string is a match', async () => {
    expect(
      highlightMatches(
        [
          {
            value: 'foo bar baz',
            isMatch: true,
          },
        ],
        chalk.bgGreen
      )
    ).toEqual(chalk.bgGreen('foo bar baz'));
  });

  it('returns a colored string if part of the string is a match', async () => {
    expect(
      highlightMatches(
        [
          {
            value: 'foo',
            isMatch: true,
          },
          {
            value: 'bar',
            isMatch: false,
          },
          {
            value: 'baz',
            isMatch: true,
          },
          {
            value: 'qux',
            isMatch: false,
          },
        ],
        chalk.bgRed
      )
    ).toEqual(`${chalk.bgRed(`foo`)}bar${chalk.bgRed(`baz`)}qux`);
  });
});
