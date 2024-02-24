import { Selector, SugarcubeParser } from '../../..';
import { innerText } from './inner-text';
import * as inputs from '../../../../test/inner-text-html.inputs';

describe(`innerText html`, () => {
  it(`returns text string`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: 'passage text',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`body`).innerText)
      .contains(`passage text`);
  });

  it('keeps newlines while completely squashing spaces between them', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
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
          tags: ['passage tag'],
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

  describe('whitespace between text and elements', () => {
    type BetweenTextAndElement = string;
    type MultipleNestedElement = string;
    type BetweenElementAndText = string;

    interface TestDatum {
      whitespace: ' ' | '\n';
      text: ['foo' | 'bar', 'foo' | 'bar'];
      element: 'div' | 'span';
      expected: [
        BetweenTextAndElement,
        MultipleNestedElement,
        BetweenElementAndText,
      ];
    }

    (
      [
        {
          whitespace: ' ',
          text: ['foo', 'bar'],
          element: `div`,
          expected: [`foo\nbar`, `foo\nbar`, `foo\nbar`],
        },
        {
          whitespace: '\n',
          text: ['foo', 'bar'],
          element: `div`,
          expected: [
            `\nfoo\n\n\n\nbar\n\n\n`,
            `\n\n\n\n\nfoo\n\n\n\n\n\n\nbar\n\n\n\n\n`,
            `\n\n\nfoo\n\n\nbar\n\n`,
          ],
        },
        {
          whitespace: ' ',
          text: ['foo', 'bar'],
          element: `span`,
          expected: [`foo bar`, `foo bar`, `foo bar`],
        },
        {
          whitespace: '\n',
          text: ['foo', 'bar'],
          element: `span`,
          expected: [
            `\nfoo\n\n\nbar\n\n`,
            `\n\n\nfoo\n\n\n\n\nbar\n\n\n`,
            `\n\nfoo\n\nbar\n\n`,
          ],
        },
      ] satisfies TestDatum[]
    ).forEach(({ whitespace, text, element, expected }) => {
      it(`squashes ${
        whitespace === ' ' ? 'spaces' : 'newlines'
      } between text and ${element} elements`, async () => {
        const sugarcubeParser = await SugarcubeParser.create({
          passages: [
            {
              title: 'passage title',
              tags: ['passage tag'],
              text: `${whitespace}${text[0]}${whitespace}${whitespace}<${element}>${whitespace}${text[1]}${whitespace}</${element}>${whitespace}`,
            },
          ],
        });

        await sugarcubeParser.testController
          .goto('passage title')
          .expect(Selector(`.passage`).innerText)
          .eql(expected[0]);
      });

      it(`squashes ${
        whitespace === ' ' ? 'spaces' : 'newlines'
      } between multiple nested ${element} elements`, async () => {
        const sugarcubeParser = await SugarcubeParser.create({
          passages: [
            {
              title: 'passage title',
              tags: ['passage tag'],
              text: `${whitespace}<${element}>${whitespace}<${element}>${whitespace}${text[0]}${whitespace}</${element}>${whitespace}${whitespace}${whitespace}<${element}>${whitespace}${text[1]}${whitespace}</${element}>${whitespace}</${element}>${whitespace}`,
            },
          ],
        });

        await sugarcubeParser.testController
          .goto('passage title')
          .expect(Selector(`.passage`).innerText)
          .eql(expected[1]);
      });

      it(`squashes ${
        whitespace === ' ' ? 'spaces' : 'newlines'
      } between ${element} elements and text`, async () => {
        const sugarcubeParser = await SugarcubeParser.create({
          passages: [
            {
              title: 'passage title',
              tags: ['passage tag'],
              text: `${whitespace}<${element}>${whitespace}${text[0]}${whitespace}</${element}>${whitespace}${text[1]}${whitespace}${whitespace}`,
            },
          ],
        });

        await sugarcubeParser.testController
          .goto('passage title')
          .expect(Selector(`.passage`).innerText)
          .eql(expected[2]);
      });
    });
  });

  /*
Last column is original node.textContent:
│   68    │ 'handleHasChildNodes' │         'SPAN.you-say say'         │                                  '"\\"What·is·it?One·them·critter·girls?\\""'                                  │
│   69    │     'handleText'      │              '#text'               │                                              '"\\"What·is·it?·"'                                               │
│   70    │     'handleText'      │              '#text'               │                                    '"·······One·them·critter·girls?·····"'                                     │
│   71    │     'handleText'      │              '#text'               │                                                    '"\\""'                                                     │
*/
  it('squashes spaces down to one between text nodes', async () => {
    await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
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
            tags: ['passage tag'],
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
