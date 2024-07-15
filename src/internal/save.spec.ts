import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';

describe(`Save`, () => {
  fit('can save and load', async () => {
    const passages = [
      {
        title: 'passage title 1',
        tags: ['passage tag 1'],
        text: 'page 1',
      },
      {
        title: 'passage title 2',
        tags: ['passage tag 2'],
        text: 'page 2',
      },
      {
        title: 'passage title 3',
        tags: ['passage tag 3'],
        text: 'page 3',
      },
    ];

    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await sugarcubeParser.testController
      .goto('passage title 1')
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .expect(Selector(`#ui-dialog.open`).exists)
      .ok()
      // Click the save button
      .click(Selector(`#saves-save-0`), { waitFor: 'click end' })
      // The Dialog should close
      .expect(Selector(`#ui-dialog.open`).exists)
      .notOk()
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      // If we open the Save Dialog, there is a load button and the delete button is disabled
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .logDocument({ includeHeadElement: false })
      .expect(Selector(`#saves-load-0`).exists)
      .ok()
      .expect(Selector(`#saves-delete-0`).hasAttribute('disabled'))
      .notOk()
      .expect(Selector(`#saves-save-0`).exists)
      .notOk();
  });
});
