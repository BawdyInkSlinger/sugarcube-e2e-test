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
  
  fit(`returns example1`, async () => {
    const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: html1,
      },
    ]);

    await sugarcubeParser.testController
    .goto('passage title');
    
    console.log(document.toPrettyString());

    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql(expected1);
  });
});
