import { Selector, SugarcubeParser } from '../src';
import { innerText } from '../src/test-api/internal/inner-text/inner-text';
import * as inputs from './inner-text.inputs';

describe(`innerText`, () => {
  it(`returns text string`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'passage text',
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`body`).innerText)
      .contains(`passage text`);
  });

  it(`completely squashes spaces between newlines`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'a<br><br>    <br><br>b',
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`a\n\n\n\nb`);
  });

  it(`replaces newline characters with blank`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: `You'll give her one thing: 
she's determined.`,
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`You'll give her one thing: she's determined.`);
  });

  it(`squashes space between text and inline elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: `foo  <span> bar </span> `,
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`foo bar`);
  });

  it('squashes space between inline elements and text', async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: `<span> foo </span> bar  `,
      },
    ]);

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`foo bar`);
  });

  /*
Last column is original node.textContent:
│   68    │ 'handleHasChildNodes' │         'SPAN.you-say say'         │                                  '"\\"What·is·it?One·them·critter·girls?\\""'                                  │
│   69    │     'handleText'      │              '#text'               │                                              '"\\"What·is·it?·"'                                               │
│   70    │     'handleText'      │              '#text'               │                                    '"·······One·them·critter·girls?·····"'                                     │
│   71    │     'handleText'      │              '#text'               │                                                    '"\\""'                                                     │
*/
  it('squashes spaces down to one between text nodes', async () => {
    await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'passage text',
      },
    ]); // done for side effect: Initializes `document`

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

      const sugarcubeParser = await SugarcubeParser.create([
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: html,
        },
      ]);

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector(`.passage`).innerText)
        .eql(expected, `Error in example ${index}`);
    }
  });
});
