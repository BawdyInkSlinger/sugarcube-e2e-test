import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';

describe(`Save`, () => {
  it('can save and load', async () => {
    const passages = [
      {
        title: 'passage title 1',
        tags: ['passage tag 1'],
        text: 'page 1 <<button "passage title 2" "passage title 2">><</button>>',
      },
      {
        title: 'passage title 2',
        tags: ['passage tag 2'],
        text: 'page 2 <<button "passage title 3" "passage title 3">><</button>>',
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
      // Go to the second page:
      .click(Selector(`button`).withText(`passage title 2`))
      // If we open the Save Dialog, there is a load button and the delete button is enabled
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .expect(Selector(`#saves-load-0`).exists)
      .ok()
      .expect(Selector(`#saves-delete-0`).hasAttribute('disabled'))
      .notOk()
      .expect(Selector(`#saves-save-0`).exists)
      .notOk()
      // Save on the second page
      .click(Selector(`#saves-save-1`), { waitFor: 'click end' })
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      // Go to the third page:
      .click(Selector(`button`).withText(`passage title 3`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 3`)
      // If we open the Save Dialog, there are two saves
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .expect(Selector(`#saves-load-0`).exists)
      .ok()
      .expect(Selector(`#saves-load-1`).exists)
      .ok()
      // Load the first save
      .click(Selector(`#saves-load-0`))
      // We should be on page 1
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      // Load the second save
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .click(Selector(`#saves-load-1`))
      // We should be on page 2
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)

  });
});
