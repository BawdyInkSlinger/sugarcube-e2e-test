import { Selector, SugarcubeParser } from '../../..';
import { innerText } from './inner-text';
import * as inputs from '../../../../test/inner-text-html-nobr.inputs';

describe(`innerText html nobr`, () => {
  it(`returns text string`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: 'passage text',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`body`).innerText)
      .contains(`passage text`);
  });

  it('removes BRs and completely squashes spaces between them', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: 'a<br><br>    <br><br>b',
        },
        {
          title: 'passage title nested div',
          tags: ['passage tag nested'],
          text: '<div>a<br><br>    <br><br>b</div>',
        },
        {
          title: 'passage title nested span',
          tags: ['passage tag nested'],
          text: '<span>a<br><br>    <br><br>b</span>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage').innerText)
      .eql(`a\n\n\n\nb`)
      .goto('passage title nested div')
      .expect(Selector('.passage').innerText)
      .eql(`a\n\n\n\nb`)
      .goto('passage title nested span')
      .expect(Selector('.passage').innerText)
      .eql(`a\n\n\n\nb`);
  });

  it(`replaces newline characters with blank`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: `You'll give her one thing: 
she's determined.`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`You'll give her one thing: she's determined.`);
  });

  it('squashes spaces down to one between text nodes', async () => {
    await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: 'passage text',
        },
      ],
    }); // done for side effect}: Initializes `document`

    const actual = innerText({
      childNodes: [
        document.createTextNode(` "What is it? `),
        document.createTextNode(`       One them critter girls?     `),
        document.createTextNode(`" `),
      ],
    } as any);
    expect(actual).toEqual(`"What is it? One them critter girls? "`);
  });

  it(`returns expectations using real examples`, async () => {
    const exampleCount = Object.getOwnPropertyNames(inputs).length / 2;
    expect(exampleCount).toBeGreaterThan(0);
    for (let index = 1; index <= exampleCount; index++) {
      const html = inputs[`html${index}`];
      const expected = inputs[`expected${index}`];

      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag', 'nobr'],
            text: html,
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector(`.passage`).innerText)
        .eql(expected, `Error in example ${index}`);
    }
  });
});
