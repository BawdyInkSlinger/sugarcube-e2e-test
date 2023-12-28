import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`selector`, () => {
  it('returns the text of the first matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button:disabled').nth(0).innerText)
      .eql(`Button 1`);
  });

  it('returns the text of the second matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button:disabled').nth(1).innerText)
      .eql(`Button 3`);
  });

  it('can click a button withText', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
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
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .click(Selector('.passage button').withText(`Button 2`))
      .expect(Selector('.passage').innerText)
      .eql(`Destination`);
  });
});
