import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

fdescribe(`visible`, () => {
  it('returns true for visible elements', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button:disabled').visible)
      .ok();
  });

  it('returns true for elements with opacity: 0', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="opacity: 0">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .ok();
  });

  it('returns false for elements with display: none', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="display: none">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with visibility: hidden', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style=" visibility :  hidden ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with visibility: collapse', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style=" visibility :  collapse ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with width: 0', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="width: 0 ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with width: 0em', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="width: 0em ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with height: 0', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="height : 0 ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });

  it('returns false for elements with height: 0em', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button style="height : 0em ">Button 1</button>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage button').visible)
      .notOk();
  });
});
