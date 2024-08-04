import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';
import { TestController } from '../test-api/test-controller';

describe('HTMLDialogElement', () => {
  const passageDoneText = `
          <<script>>
          const $dialog = $("#d")
          .on('click', function (event) {
            if (event.target === this) {
                $dialog[0].close();
            }
          });
          $('button.open-dialog')
            .ariaClick({ label: 'Open Dialog' }, () => {
                $dialog[0].showModal();
            });
        <</script>>
              `;

  it('has a showModal function when a shared sugarcubeParser is reused 1', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'Passage 1',
          tags: [],
          text: `
          <dialog id="d">
            Hello!
          </dialog>
          <button class="open-dialog">Open Dialog</button>
          `,
        },
        {
          title: 'PassageDone',
          tags: [],
          text: passageDoneText,
        },
      ],
    });

    await testSetupDialog(sugarcubeParser.testController);
    await testSetupDialog(sugarcubeParser.testController);
  });

  it('has a showModal function when a shared sugarcubeParser is reused 2', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'Passage 1',
          tags: [],
          text: `
          <dialog id="d">
            Hello!
          </dialog>
          <button class="open-dialog">Open Dialog</button>
          `,
        },
        {
          title: 'PassageDone',
          tags: [],
          text: passageDoneText,
        },
      ],
    });

    await testSetupDialog(sugarcubeParser.testController);
    await testSetupDialog(sugarcubeParser.testController);
  });

  async function testSetupDialog(t: TestController) {
    await t
      .goto('Passage 1')
      .expect(Selector(`dialog`).getStyleProperty(`display`))
      .eql('none')
      .expect(Selector(`dialog[open]`).exists)
      .notOk()
      // open dialog
      .click(Selector(`button`).withText(`Open Dialog`), {
        waitFor: 'click end',
      })
      .expect(Selector(`dialog[open]`).exists)
      .ok()
      .expect(Selector(`dialog`).getStyleProperty(`display`))
      .eql('block')
      // close dialog
      .click(Selector(`dialog`), {
        waitFor: 'click end',
      })
      .expect(Selector(`dialog`).getStyleProperty(`display`))
      .eql('none')
      .expect(Selector(`dialog[open]`).exists)
      .notOk();
  }
});
