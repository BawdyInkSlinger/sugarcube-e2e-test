import { SugarcubeParser } from '../src';

describe(`innerText`, () => {
  

  it(`returns a string`, async () => {
  const sugarcubeParser = await SugarcubeParser.create([
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'passage text',
      },
    ]);

    await sugarcubeParser.testController;
  });
});
// TODO: remove e2e config
