import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`assertions`, () => {
  describe(`gte`, () => {
    it('passes when actual is greater than expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">5</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .gte(3);
    });

    it('passes when actual is equal to expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">7</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .gte(7);
    });

    it('errors when actual is less than expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">2</div>',
          },
        ],
      });

      await sugarcubeParser.testController.goto('passage title');

      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .gte(13)
      ).toBeRejectedWithError(/^2 >= 13$/m);
    });

    it('errors when actual is not a number', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">foobar</div>',
          },
        ],
      });

      await sugarcubeParser.testController.goto('passage title');

      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .gte(13)
      ).toBeRejectedWithError(/"foobar" is not a number/);
    });
  });
});
