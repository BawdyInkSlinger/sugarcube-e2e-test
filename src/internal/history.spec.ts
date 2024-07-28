import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';

describe(`History`, () => {
  async function forwardBackwardTest(sugarcubeParser: SugarcubeParser) {
    await sugarcubeParser.testController
    //   .log(`Go to the 1st page`)
      .goto('passage title 1')
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .notOk()
      .expect(Selector(`#history-forward:enabled`).exists)
      .notOk();
    // Go to the second page:
    await sugarcubeParser.testController
    //   .log(`Go to the 2nd page`)
      .click(Selector(`button`).withText(`passage title 2`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .ok()
      .expect(Selector(`#history-forward:enabled`).exists)
      .notOk();
    // Go to the third page:
    await sugarcubeParser.testController
    //   .log(`Go to the 3rd page`)
      .click(Selector(`button`).withText(`passage title 3`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 3`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .ok()
      .expect(Selector(`#history-forward:enabled`).exists)
      .notOk();
    await sugarcubeParser.testController
    //   .log(`clicking a history button`)
      .click(Selector('#history-backward'))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .ok()
      .expect(Selector(`#history-forward:enabled`).exists)
      .ok();
    // Go back
    await sugarcubeParser.testController
    //   .log(`clicking a history button`)
      .click(Selector('#history-backward'))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .notOk()
      .expect(Selector(`#history-forward:enabled`).exists)
      .ok();
    // Go forward
    await sugarcubeParser.testController
    //   .log(`clicking a history button`)
      .click(Selector('#history-forward'))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      .expect(Selector(`#history-backward:enabled`).exists)
      .ok()
      .expect(Selector(`#history-forward:enabled`).exists)
      .ok();
  }

  it('can go backward and forward with a reused parser', async () => {
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
    await forwardBackwardTest(sugarcubeParser);

    sugarcubeParser.resetState();
    await forwardBackwardTest(sugarcubeParser);
  });

  it('can go backward and forward with a custom StoryInterface', async () => {
    const passageEndHandler = `
$(document).on(':passageend', function (ev) {
  $(\`#history-backward\`)
    .ariaClick({ label: 'Go backward within the game history' }, () => {
      Engine.backward();
    })
    .ariaDisabled(State.length < 2)
    .ariaIsDisabled() &&
    $(\`#history-backward\`).prop('disabled', true);

  $(\`#history-forward\`)
    .ariaClick({ label: 'Go forward within the game history' }, () => {
      Engine.forward();
    })
    .ariaDisabled(State.length === State.size)
    .ariaIsDisabled() &&
    $(\`#history-forward\`).prop('disabled', true);
});
    `;
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
      {
        title: 'StoryInterface',
        tags: [],
        text: `
        <!-- data-passage recreates the buttons on every passageend event -->
        <div data-passage="History Buttons"></div>
        <div id="passages"></div>
        `,
      },
      {
        title: 'History Buttons',
        tags: [],
        text: `
        <button id="history-backward" class="history__button menu__button">Backward</button>
        <button id="history-forward" class="history__button menu__button">Forward</button>
        `,
      },
      {
        title: 'Script',
        tags: [`script`],
        text: passageEndHandler,
      },
    ];

    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await forwardBackwardTest(sugarcubeParser);

    sugarcubeParser.resetState();
    await forwardBackwardTest(sugarcubeParser);
  });
});
