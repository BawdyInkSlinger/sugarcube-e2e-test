import { SugarcubeParser } from '../src';

describe(`innerText`, () => {

  it(`returns a string`, async () => {
    const { testController } = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'passage text',
      },
    ]);
  });
});
