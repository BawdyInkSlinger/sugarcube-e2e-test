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

  it('can use macros in subsequent SugarcubeParser.create calls', async () => {
    await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'abc',
      },
    ]);

    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: '<<button "Button">><</button>>',
      },
    ]);

    await sugarcubeParser.testController.goto('passage title');
  });
});
