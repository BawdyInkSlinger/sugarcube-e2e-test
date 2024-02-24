import { Selector, SugarcubeParser } from '../../..';
import * as inputs from '../../../../test/inner-text-wiki.inputs';

describe(`innerText wiki`, () => {
  // space / span
  it(`squashes spaces between text and span elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` FOO  <span> BAR </span> `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(`FOO   BAR `);
  });

  it(`squashes spaces between multiple nested span elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` <span> <span> FOO </span>   <span> BAR </span> </span> `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("  FOO     BAR  ");
  });

  it(`squashes spaces between span elements and text`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` <span> FOO </span> BAR  `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(" FOO  BAR");
  });

  // newline / span
  it(`squashes newlines between text and span elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\nFOO\n\n<span>\nBAR\n</span>\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

  it(`squashes newlines between multiple nested span elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\n<span>\n<span>\nFOO\n</span>\n\n\n<span>\nBAR\n</span>\n</span>\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

  it(`squashes newlines between span elements and text`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\n<span>\nFOO\n</span>\nBAR\n\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

  // space / div
  it(`squashes spaces between text and div elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` FOO  <div> BAR </div> `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOO   BAR ");
  });

  it(`squashes spaces between multiple nested div elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` <div> <div> FOO </div>   <div> BAR </div> </div> `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("  FOO     BAR  ");
  });

  it(`squashes spaces between div elements and text`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` <div> FOO </div> BAR  `,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql(" FOO  BAR");
  });

  // newline / div
  it(`squashes newlines between text and div elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\nFOO\n\n<div>\nBAR\n</div>\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

  it(`squashes newlines between multiple nested div elements`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\n<div>\n<div>\nFOO\n</div>\n\n\n<div>\nBAR\n</div>\n</div>\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

  it(`squashes newlines between div elements and text`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `\n<div>\nFOO\n</div>\nBAR\n\n`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql("FOOBAR");
  });

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
        .eql("expected", `Error in example ${index}`);
    }
  });
});
