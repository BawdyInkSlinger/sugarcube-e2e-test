import { Selector, SugarcubeParser, TestController } from '.';
import './test-api/internal/monkey-patching/jsdom/strings';

describe('Setup', () => {
  const init = {
    title: 'StoryInit',
    tags: [],
    text: `
<<set setup.init_s1_s2 = 'story init'>>
<<set setup.init = 'story init'>>
        `,
  };

  const s1 = {
    title: '_s1',
    tags: ['script'],
    text: `
setup.init_s1_s2 = '_s1';
setup.s1 = '_s1';
setup.s1_s2 = 's1';
`,
  };

  const s2 = {
    title: 's2',
    tags: ['script'],
    text: `
setup.init_s1_s2 = 's2';
setup.s1_s2 = 's2';
setup.s2 = 's2';
`,
  };

  const start = {
    title: 'Start',
    tags: [],
    text: `
<<button "setup.start = 1" \`passage()\`>><<script>>setup.start = 1<</script>><</button>>

setup.init_s1_s2: <span class="init_s1_s2"><<= setup.init_s1_s2>></span>
setup.s1: <span class="s1"><<= setup.s1>></span>
setup.s2: <span class="s2"><<= setup.s2>></span>
setup.s1_s2: <span class="s1_s2"><<= setup.s1_s2>></span>
setup.start: <span class="start"><<= setup.start>></span>
setup.init: <span class="init"><<= setup.init>></span>
`,
  };

  it(`resets setup and recreates it correctly`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [init, s1, s2, start],
    });
    const t = sugarcubeParser.testController;

    await t.goto('Start');

    await assertValues(t, {
      init_s1_s2: 'story init',
      s1: '_s1',
      s2: 's2',
      s1_s2: 's2',
      start: '[undefined]',
      init: 'story init',
    });
    // click the button to initialize c
    await t.click(Selector(`.passage button`).withText(`setup.start = 1`));
    await assertValues(t, {
      init_s1_s2: 'story init',
      s1: '_s1',
      s2: 's2',
      s1_s2: 's2',
      start: '1',
      init: 'story init',
    });

    sugarcubeParser.resetState();

    await t.goto('Start');
    await assertValues(t, {
      init_s1_s2: 'story init',
      s1: '_s1',
      s2: 's2',
      s1_s2: 's2',
      start: '[undefined]',
      init: 'story init',
    });
  });

  it(`runs the script passages in the order they're defined`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [init, s2, s1, start],
    });
    const t = sugarcubeParser.testController;

    await t.goto('Start');

    await assertValues(t, {
      init_s1_s2: 'story init',
      s1: '_s1',
      s2: 's2',
      s1_s2: 's1',
      start: '[undefined]',
      init: 'story init',
    });
  });

  type SetupValues = {
    init_s1_s2: string;
    s1: string;
    s2: string;
    s1_s2: string;
    start: string;
    init: string;
  };

  async function assertValues(
    testController: TestController,
    { init_s1_s2, s1, s2, s1_s2, start, init }: SetupValues
  ) {
    await testController
      .expect(Selector(`.init_s1_s2`).innerText)
      .eql(init_s1_s2)
      .expect(Selector(`.s1`).innerText)
      .eql(s1)
      .expect(Selector(`.s2`).innerText)
      .eql(s2)
      .expect(Selector(`.s1_s2`).innerText)
      .eql(s1_s2)
      .expect(Selector(`.start`).innerText)
      .eql(start)
      .expect(Selector(`.init`).innerText)
      .eql(init);
  }
});
