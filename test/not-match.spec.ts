import { Selector, SugarcubeParser } from '../src';

describe('Assertion.notMatch', () => {
  it('passes when there is no match', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'SugarcubeParser title',
        tags: ['SugarcubeParser tag'],
        text: 'SugarcubeParser text',
      },
    ]);

    await sugarcubeParser.testController
      .goto('SugarcubeParser title')
      .expect(Selector(`.passage`).innerText)
      .notMatch(/unrelated/);
  });

  it('fails when there is a single match', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'SugarcubeParser title',
        tags: ['SugarcubeParser tag'],
        text: 'SugarcubeParser text',
      },
    ]);

    await expectAsync(sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .notMatch(/Parser/)
    ).toBeRejectedWithError(/To NOT match:/);
    await expectAsync(sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .notMatch(/Parser/)
    ).toBeRejectedWithError(/\/Parser\//);
  });

  it('fails when there are multiple matches', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'SugarcubeParser title',
        tags: ['SugarcubeParser tag'],
        text: 'SugarcubeParser text',
      },
    ]);

    await expectAsync(sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .notMatch(/(Parser|text)/)
    ).toBeRejectedWithError(/To NOT match:/);
    await expectAsync(sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .notMatch(/(Parser|text)/)
    ).toBeRejectedWithError(/\/\(Parser\|text\)\//);
  });
});
