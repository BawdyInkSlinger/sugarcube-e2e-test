import { Selector, SugarcubeParser } from '../../..';
import * as inputs from '../../../../test/inner-text-wiki.inputs';

xdescribe(`innerText wiki`, () => {
  it(`returns expectations using real examples`, async () => {
    const exampleCount = Object.getOwnPropertyNames(inputs).length / 4;
    expect(exampleCount).toBeGreaterThan(0);
    for (let index = 1; index <= exampleCount; index++) {
      const wiki = inputs[`wiki${index}`];
      const expected = inputs[`expected${index}`];
      const tags = inputs[`passageTags${index}`];
      const state = inputs[`state${index}`];

      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: tags,
            text: wiki,
          },
        ],
      });
      Object.assign(globalThis.State.variables, state.variables);

      await sugarcubeParser.testController
        .goto('passage title', state.temporary)
        .expect(Selector(`.passage`).innerText)
        .eql(expected, `Error in example ${index}`);
    }
  });
});
