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

    it('errors with a custom message', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">3</div>',
          },
        ],
      });

      await sugarcubeParser.testController.goto('passage title');

      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .gte(13, 'custom message')
      ).toBeRejectedWithError(/^3 >= 13$/m);
      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .gte(13, 'custom message')
      ).toBeRejectedWithError(/custom message/);
    });
  });

  describe(`notContains`, () => {
    it('passes when actual does NOT contain expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">foobar</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .notContains('baz');
    });

    it('errors when actual IS contained in expected', async () => {
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
          .notContains('oob')
      ).toBeRejectedWithError(/To NOT Contain:/);
    });

    it('errors with a custom message', async () => {
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
          .notContains('oob', 'custom message')
      ).toBeRejectedWithError(/To NOT Contain:/);
      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .notContains('oob', 'custom message')
      ).toBeRejectedWithError(/custom message/);
    });
  });

  describe(`contains`, () => {
    it('passes when actual IS contained in expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">foobar</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .contains('oob');
    });

    it('errors when actual does NOT contain expected', async () => {
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
          .contains('baz')
      ).toBeRejectedWithError(/To Contain:/);
    });

    it('errors with a custom message', async () => {
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
          .contains('baz', 'custom message')
      ).toBeRejectedWithError(/To Contain:/);
      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .contains('baz', 'custom message')
      ).toBeRejectedWithError(/custom message/);
    });
  });
  
  describe(`match`, () => {
    it('passes when actual matches expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">foobar</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .match(/oob/);
    });

    it('errors when actual does NOT match expected', async () => {
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
          .match(/baz/)
      ).toBeRejectedWithError(/To Match:/);
    });

    it('errors with a custom message', async () => {
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
          .match(/baz/, 'custom message')
      ).toBeRejectedWithError(/To Match:/);
      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .match(/baz/, 'custom message')
      ).toBeRejectedWithError(/custom message/);
    });
  });

  describe(`notEql`, () => {
    it('passes when actual notEql to expected', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: '<div id="value">foobar</div>',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector('#value').innerText)
        .notEql(`oob`);
    });

    it('errors when actual equals expected', async () => {
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
          .notEql(`foobar`)
      ).toBeRejectedWithError(/To NOT Equal:/);
    });

    it('errors with a custom message', async () => {
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
          .notEql(`foobar`, 'custom message')
      ).toBeRejectedWithError(/To NOT Equal:/);
      await expectAsync(
        sugarcubeParser.testController
          .expect(Selector('#value').innerText)
          .notEql(`foobar`, 'custom message')
      ).toBeRejectedWithError(/custom message/);
    });
  });
});
