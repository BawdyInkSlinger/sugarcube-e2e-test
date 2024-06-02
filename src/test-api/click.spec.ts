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

  it('gives a useful error if you wait for passage end (default click strategy) but the click does not render a new passage', async () => {
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
      .eql(`pending`);

    try {
      await sugarcubeParser.testController.click(Selector('.passage button'));
      fail(`Error expected`);
    } catch (parentError) {
      expect(parentError.message).toEqual('Click error');
      const childError = parentError.cause;
      expect(childError.message).toMatch(/waiting for a :passageend/);
      const grandchildError = childError.cause;
      expect(grandchildError.message).toMatch(/Timed out after/);
    }
  });

  it('gives a useful error if the selector cannot be found', async () => {
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
      .eql(`Passage 1`);

    try {
        await sugarcubeParser.testController.click(
          Selector('.passage button').withText('foobar')
        );
      fail(`Error expected`);
    } catch (parentError) {
      expect(parentError.message).toEqual('Click error');
      const childError = parentError.cause;
      expect(childError.message).toEqual('Click error');
      const grandchildError = childError.cause;
      expect(grandchildError.message).toEqual(
        'Attempted to click on selector that could not be found: Selector(`.passage button:contains(foobar)`)'
      );
    }
  });
});
