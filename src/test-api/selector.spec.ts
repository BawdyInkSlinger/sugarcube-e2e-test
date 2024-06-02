import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`selector`, () => {
  it('returns the text of the first matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button:disabled').nth(0).innerText)
      .eql(`Button 1`);
  });

  it('returns the text of the second matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button:disabled').nth(1).innerText)
      .eql(`Button 3`);
  });

  it('can click a button withText', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2" "passage 2">><</button>> <button disabled>Button 3</button>',
        },
        {
          title: 'passage 2',
          tags: ['passage tag'],
          text: 'Destination',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .click(Selector('.passage button').withText(`Button 2`), {
        waitFor: 'click end',
      })
      .expect(Selector('.passage').innerText)
      .eql(`Destination`);
  });

  it('can click a button that stays on the current passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<if $counter === undefined>><<set $counter to 0>><</if>>
        <<button "Add P">>
            <<set _counter to _counter + 1>>
            <<append "#dynamic-container">>
                <p @class="'paragraph-' + _counter">Paragraph 1</p>
            <</append>>
        <</button>>
        <div id="dynamic-container"></div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage p').exists)
      .eql(false)
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector('.passage p').exists)
      .eql(true);
  });

  it('can return a count', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<if $counter === undefined>><<set $counter to 0>><</if>>
        <<button "Add P">>
            <<set _counter to _counter + 1>>
            <<append "#dynamic-container">>
                <p @class="'paragraph-' + _counter">Paragraph 1</p>
            <</append>>
        <</button>>
        <div id="dynamic-container"></div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage p').count)
      .eql(0)
      // first click
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector('.passage p').count)
      .eql(1)
      // second click
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector('.passage p').count)
      .eql(2)
      // search for a paragraph that doesn't exist
      .expect(Selector('.passage p.paragraph-3').count)
      .eql(0);
  });

  it('fails fast when the selector does not exist', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: `<h1>Passage 1</h1>`,
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector(`.passage h1`).innerText)
        .eql(`Passage 1`);

      await expectAsync(
        sugarcubeParser.testController.expect(Selector('.passage h2').innerText).eql(`This selector does not exist`)
      ).toBeRejectedWithError(
        'Selector(`.passage h2`) does not exist'
      );
  });
});
