import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`selector withText and withExactText`, () => {
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

  it('has withExactText', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<button disabled>Button A</button> <<button "Button ZA">><</button>> <button disabled>Button ABC</button> <button>Button A</button>`,
        },
      ],
    });

    const reExecutablePromise =
      Selector('button').withExactText(`Button A`).count;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('button').withText(`Button A`).count)
      .eql(3)
      .expect(reExecutablePromise)
      .eql(2);
  });

  it('has withExactText with complex selector', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<div id="outer"><div class="inner"><button disabled>Button A</button> <<button "Button ZA">><</button>> <button disabled>Button ABC</button> <button>Button A</button></div></div>`,
        },
      ],
    });

    const reExecutablePromise = Selector('#outer .inner button').withExactText(
      `Button A`
    ).count;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('#outer .inner button').withText(`Button A`).count)
      .eql(3)
      .expect(reExecutablePromise)
      .eql(2);
  });
  
  it('counts as "exact text" when the exact text is nested within child elements', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<div id="nested-one-child"><span>foobar</span></div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('#nested-one-child').withExactText(
        `foobar`
      ).exists)
      .ok()
  });
});
