import { Selector, SugarcubeParser } from '../src';
import { expected1, html1 } from './inner-text.inputs';

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

  it(`returns example1`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: html1,
      },
    ]);

    await sugarcubeParser.testController.goto('passage title');

    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql(expected1);
  });
});
