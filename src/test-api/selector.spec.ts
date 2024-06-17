import { SugarcubeParser } from '../sugarcube-parser';
import ReExecutablePromise from './internal/re-executable-promise';
import { Selector } from './selector';

describe(`selector`, () => {
  it('returns the text of the first matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
        },
      ],
    });

    const reExecutablePromise = Selector('.passage button:disabled').nth(
      0
    ).innerText;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .eql(`Button 1`);
  });

  it('returns the text of the second matched element', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2">><</button>> <button disabled>Button 3</button>',
        },
      ],
    });

    const reExecutablePromise = Selector('.passage button:disabled').nth(
      1
    ).innerText;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .eql(`Button 3`);
  });

  it('can click a button that stays on the current passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<if $counter === undefined>><<set $counter to 0>><</if>>
        <<button "Add P">>
            <<set _counter to _counter + 1>>
            <<append "#dynamic-container">>
                <p @class="'paragraph-' + _counter">Paragraph 1</p>
            <</append>>
        <</button>>
        <div id="dynamic-container"></div>`,
        },
      ],
    });

    const reExecutablePromise = Selector('.passage p').exists;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .eql(false)
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(reExecutablePromise)
      .eql(true);
  });

  it('can return a count', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<if $counter === undefined>><<set $counter to 0>><</if>>
        <<button "Add P">>
            <<set _counter to _counter + 1>>
            <<append "#dynamic-container">>
                <p @class="'paragraph-' + _counter">Paragraph 1</p>
            <</append>>
        <</button>>
        <div id="dynamic-container"></div>`,
        },
      ],
    });

    const reExecutablePromise = Selector('.passage p.paragraph-3').count;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('.passage p').count)
      .eql(0)
      // first click
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector('.passage p').count)
      .eql(1)
      // second click
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector('.passage p').count)
      .eql(2)
      // search for a paragraph that doesn't exist
      .expect(reExecutablePromise)
      .eql(0);
  });

  it('fails fast when the selector does not exist', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<h1>Passage 1</h1>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage h1`).innerText)
      .eql(`Passage 1`);

    await expectAsync(
      sugarcubeParser.testController
        .expect(Selector('.passage h2').innerText)
        .eql(`This selector does not exist`)
    ).toBeRejectedWithError('Selector(`.passage h2`) does not exist');
  });

  it('has hasAttribute', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<h1>Passage 1</h1><button disabled>Disabled Button</button><button>Enabled Button</button>`,
        },
      ],
    });

    const reExecutablePromise = Selector(`.passage button`)
      .withText('Disabled Button')
      .hasAttribute('disabled');

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .ok()
      .expect(
        Selector(`.passage button`)
          .withText('Enabled Button')
          .hasAttribute('disabled')
      )
      .notOk();
  });

  it(`lets you use nth and hasAttribute together`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: `
<div class="a unrelated">
  <div class="a1">Foo</div>
  <div class="a2" data-nokey="true">
    <div class="b">
      <button
        class="c"
        title=""
        tabindex="0"
      >
        <div class="c1"></div>
        <span class="c2">1</span>
      </button>
    </div>
  </div>
</div>
<div class="a unrelated">
  <div class="a1">Bar</div>
  <div class="a2" data-nokey="true">
    <div class="b">
      <button
        disabled=""
        class="c"
        title=""
        tabindex="0"
      >
        <div class="c1"></div>
        <span class="c2">2</span>
      </button>
    </div>
  </div>
</div>
`,
        },
      ],
    });

    const baseSelector = '.passage .a .a2 button';
    const reExecutablePromise = Selector(baseSelector)
      .nth(1)
      .hasAttribute('disabled');

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(baseSelector).count)
      .eql(2)
      .expect(Selector(baseSelector).nth(1).innerHTML)
      .contains('<span class="c2">2</span>')
      .expect(reExecutablePromise)
      .ok();
  });

  it(`has parent()`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: `
<div>
    <div>
        <p class="with-content">p1</p>
        <div class="with-content">div1</div>
    </div>
</div>
<div>
    <div>
        <p class="with-content">p2</p>
        <div class="with-content">div2</div>
    </div>
</div>
`,
        },
      ],
    });

    const reExecutablePromise = Selector(`.passage div.with-content`)
      .nth(1)
      .parent().innerText;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage div.with-content`).nth(1).innerText)
      .eql(`div2`)
      .expect(Selector(`.passage div.with-content`).nth(1).parent().innerText)
      .contains(`p2`)
      .expect(reExecutablePromise)
      .contains(`div2`);
  });

  it(`has find()`, async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag', 'nobr'],
          text: `
<p class="with-content">p0</p>
<div>
    <div>
        <p class="with-content">p1</p>
        <div class="with-content">div1</div>
    </div>
</div>
<div>
    <div>
        <p class="with-content">p2</p>
        <div class="with-content">div2</div>
    </div>
</div>
<div class="with-content">div3</div>
`,
        },
      ],
    });

    const reExecutablePromise = Selector(`.passage > div > div`)
      .nth(1)
      .find(`p`).innerText;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .eql(`p2`);
  });

  it('has innerHTML', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: ` <div> <div id="nested"> <p> Words words words <span> nest </span> </p> </div> </div> `,
        },
      ],
    });

    const reExecutablePromise = Selector('#nested').innerHTML;

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(reExecutablePromise)
      .eql(` <p> Words words words <span> nest </span> </p> `);
  });
});
