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
<<button "Open Dialog">>
    <<script>>
        Dialog.setup("Character Sheet");
        Dialog.wiki('<<button "Close Dialog">><<run Dialog.close()>><</button>>');
        Dialog.open();
    <</script>>
<</button>>
          `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('#ui-dialog.open').exists)
      .notOk()
      // click the button to open the dialog
      .click(Selector('.passage button').withText(`Open Dialog`), {
        waitFor: 'click end',
      })
      .expect(Selector('#ui-dialog.open').exists)
      .ok()
      // click the button to close the dialog
      .click(Selector('#ui-dialog-body button').withText(`Close Dialog`), {
        waitFor: 'click end',
      })
      .expect(Selector('#ui-dialog.open').exists)
      .notOk();
  });
});
