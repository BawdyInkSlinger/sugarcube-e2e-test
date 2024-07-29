import { SugarcubeParser } from '../sugarcube-parser';
import ReExecutablePromise from './internal/re-executable-promise';
import { Selector } from './selector';

describe(`selector getStyleProperty`, () => {
  it('can return the display property value', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<p class="my-element">Hello!</p>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.my-element`).getStyleProperty(`display`))
      .eql(`block`);
  });

  it('gives a helpful error when the selector finds no elements', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<p class="my-element">Hello!</p>',
        },
      ],
    });

    await sugarcubeParser.testController.goto('passage title');

    await expectAsync(
      sugarcubeParser.testController
        .expect(Selector(`.missing`).getStyleProperty(`display`))
        .eql(`block`)
    ).toBeRejectedWithError('Selector(`.missing`) does not exist');
  });
});
