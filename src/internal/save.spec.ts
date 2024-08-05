import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';
import { TestController } from '../test-api/test-controller';
import { SimplePassage } from './declarations/unofficial/simple-passage';

describe(`Save`, () => {
  let passages: SimplePassage[];
  let sugarcubeParser: SugarcubeParser;
  let t: TestController;

  beforeAll(async () => {
    passages = [
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
        text: 'page 3 <<button "Create autosave" `passage()`>><<run Save.autosave.save(`my autosave`)>><</button>> <<button "passage title 4" "passage title 4">><</button>>',
      },
      {
        title: 'passage title 4',
        tags: ['passage tag 4', 'no_saving'],
        text: 'page 4',
      },
      {
        title: 'Script',
        tags: ['script'],
        text: `
        Config.saves.autosave  = () => false; // this makes in autosave slot available, but you have to use \`Save.autosave.save()\` 
        Config.saves.isAllowed = () => {
            return !tags().includes("no_saving");
        }
        `,
      },
    ];

    sugarcubeParser = await SugarcubeParser.create({
      passages,
    });
    t = sugarcubeParser.testController;
  });

  beforeEach(async () => {
    sugarcubeParser.resetState();
    await sugarcubeParser.assignStateAndReload<unknown>({});
  });

  it('can reuse an isolated sugarcubeParser while saving and loading 1', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await testSaveAndLoad(sugarcubeParser.testController);

    sugarcubeParser.resetState();
    await sugarcubeParser.assignStateAndReload<unknown>({});

    await testSaveAndLoad(sugarcubeParser.testController);
  });

  it('can reuse a shared sugarcubeParser while saving and loading 1', async () => {
    await testSaveAndLoad(sugarcubeParser.testController);
  });

  it('can reuse a shared sugarcubeParser while saving and loading 2', async () => {
    await testSaveAndLoad(sugarcubeParser.testController);
  });

  async function testSaveAndLoad(t: TestController) {
    await t
      .goto('passage title 1')
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .expect(Selector(`#ui-dialog.open`).exists)
      .ok()
      // Autosave should exist but be disabled
      .expect(Selector('#saves-load-auto:disabled').exists)
      .ok()
      // Click the save button
      .click(Selector(`#saves-save-0:enabled`), { waitFor: 'click end' })
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
      .expect(Selector(`#saves-delete-0:enabled`).hasAttribute('disabled'))
      .notOk()
      .expect(Selector(`#saves-save-0`).exists)
      .notOk()
      // The save description is correct
      .expect(
        Selector('#saves-list div[data-added-by-bis-description-0]').innerText
      )
      .eql('page 1 passage title 2…')
      // Save on the second page
      .click(Selector(`#saves-save-1:enabled`), { waitFor: 'click end' })
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      // Go to the third page:
      .click(Selector(`button`).withText(`passage title 3`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 3`)
      // Create an autosave
      .click(Selector(`button`).withText(`Create autosave`))
      // If we open the Save Dialog, there are two saves and an autosave
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .expect(Selector(`#saves-load-0`).exists)
      .ok()
      .expect(Selector(`#saves-load-1`).exists)
      .ok()
      .expect(Selector('#saves-load-auto:enabled').exists)
      .ok()
      // Load the first save
      .click(Selector(`#saves-load-0:enabled`))
      // We should be on page 1
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      // Load the second save
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .click(Selector(`#saves-load-1:enabled`))
      // We should be on page 2
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      // Load the autosave
      .click(Selector(`#menu-item-saves a`), { waitFor: 'click end' })
      .click(Selector(`#saves-load-auto:enabled`))
      // We should be on page 3
      .expect(Selector(`.passage`).innerText)
      .contains(`page 3`)
      // Go to a page where you are not allowed to save
      .click(Selector(`button`).withText(`passage title 4`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 4`)
  }
});
