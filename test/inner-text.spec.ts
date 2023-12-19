import { Selector, SugarcubeParser } from '../src';
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

  it(`squashes spaces between newlines`, async () => {
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

  it(`replaces a single BR with blank`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: `You'll give her one thing: 
she's determined.`, // note: this newline is converted into a single <br> by sugarcube
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

  it(`returns expectations using real examples`, async () => {
    for (let index = 1; index <= 3; index++) {
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
            .eql(expected);
    }
  });
});
