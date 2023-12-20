import { Selector, SugarcubeParser } from '../src';

describe('SugarcubeParser', () => {
  it('can be created and goto a passage', async () => {
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
      .contains(`SugarcubeParser text`)
      .expect(Selector(`.passage`).innerText)
      .notContains(`SugarcubeParser t3xt`);
  });
});
