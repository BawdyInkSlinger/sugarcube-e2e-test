import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from '../test-api/selector';

describe(`History`, () => {
  fit('can go backward and forward in history', async () => {
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
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      // Go to the second page:
      .click(Selector(`button`).withText(`passage title 2`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
      // Go to the third page:
      .click(Selector(`button`).withText(`passage title 3`))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 3`)
      // Go back twice
      .logDocument({includeHeadElement: false})
      .click(Selector('#history-backward'))
      .click(Selector('#history-backward'))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 1`)
      // Go forward once
      .click(Selector('#history-forward'))
      .expect(Selector(`.passage`).innerText)
      .contains(`page 2`)
  });
});
