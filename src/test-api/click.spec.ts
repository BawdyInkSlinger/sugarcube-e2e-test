import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`click`, () => {
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
      .logDocument({includeHeadElement: false})
      .click(Selector('.passage button'), {waitFor: 'click end'})
      .expect(Selector(`#status`).innerText)
      .eql(`clicked`);
  });

  /*
error if wrong click strategy
error if selector not on page

  */
});
