import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`dialog`, () => {
  it('can use a Dialog', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `
Dialog.setup("Character Sheet");
Dialog.wiki('<<button "Close Dialog">><<run Dialog.close()>><</button>>');
Dialog.open();
          `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .click(Selector('.passage button').withText(`Close Dialog`), {
        waitFor: 'click end',
      });
  });
});
