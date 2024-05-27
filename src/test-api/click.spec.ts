import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`click`, () => {
  it('can click a button that renders a new passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<h1>Passage 1</h1><<button "Button" "passage 2">><</button>>`,
        },
        {
          title: 'passage 2',
          tags: ['passage tag'],
          text: '<h1>Passage 2</h1>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage h1`).innerText)
      .eql(`Passage 1`)
      .click(Selector('.passage button'))
      .expect(Selector(`.passage h1`).innerText)
      .eql(`Passage 2`);
  });

  it('can click a button without rendering a new passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<button "Button">>
            <<replace '#status'>>clicked<</replace>>
          <</button>>
          <div id="status">pending</div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`#status`).innerText)
      .eql(`pending`)
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector(`#status`).innerText)
      .eql(`clicked`);
  });

  /*
error if wrong click strategy
error if selector not on page

  */
});
