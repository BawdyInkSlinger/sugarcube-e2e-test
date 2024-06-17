import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`selector withText and withExactText`, () => {
  it('can click a button withText', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<button disabled>Button 1</button> <<button "Button 2" "passage 2">><</button>> <button disabled>Button 3</button>',
        },
        {
          title: 'passage 2',
          tags: ['passage tag'],
          text: 'Destination',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .click(Selector('.passage button').withText(`Button 2`), {
        waitFor: 'click end',
      })
      .expect(Selector('.passage').innerText)
      .eql(`Destination`);
  });

  describe(`withText`, () => {
    it('behaves identical to testcafe', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: `
<div id="whitespace">
  foobar
</div>
<div id="nested-one-child"><span>foobar</span></div>
<div id="deeply-nested-one-child"><div><span>foobar</span></div></div>
<div id="nested-two-child"><div><span>foo</span><span>bar</span></div></div>
<div id="deeply-nested-one-child-with-whitespace">
  <div>
    <span>foobar</span>
  </div>
</div>
<div id="nested-two-child-with-whitespace">
  <div>
    <span>foo</span>
    <span>bar</span>
  </div>
</div>
`,
          },
        ],
      });

      await sugarcubeParser.testController.goto('passage title');

      // `As one word:
      await expectAsync(
        Selector(`#whitespace`).withText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-one-child`).withText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#deeply-nested-one-child`).withText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child`).withText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#deeply-nested-one-child-with-whitespace`).withText(`foobar`)
          .exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withText(`foobar`).exists
      ).toBeResolvedTo(false);

      // `Space at end:`
      await expectAsync(
        Selector(`#whitespace`).withText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-one-child`).withText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#deeply-nested-one-child`).withText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child`).withText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#deeply-nested-one-child-with-white-space`).withText(
          `foobar `
        ).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child-with-white-space`).withText(`foobar `)
          .exists
      ).toBeResolvedTo(false);

      // `On one of two children:`
      await expectAsync(
        Selector(`#nested-two-child`).withText(`foo`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withText(`foo`).exists
      ).toBeResolvedTo(true);

      // `Substring across two children:`
      await expectAsync(
        Selector(`#nested-two-child`).withText(`ooba`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withText(`ooba`).exists
      ).toBeResolvedTo(false);
    });
  });

  describe(`withExactText`, () => {
    it('behaves identical to testcafe', async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: `
<div id="whitespace">
  foobar
</div>
<div id="nested-one-child"><span>foobar</span></div>
<div id="deeply-nested-one-child"><div><span>foobar</span></div></div>
<div id="nested-two-child"><div><span>foo</span><span>bar</span></div></div>
<div id="deeply-nested-one-child-with-whitespace">
  <div>
    <span>foobar</span>
  </div>
</div>
<div id="nested-two-child-with-whitespace">
  <div>
    <span>foo</span>
    <span>bar</span>
  </div>
</div>
`,
          },
        ],
      });

      await sugarcubeParser.testController.goto('passage title');

      // `As one word:
      await expectAsync(
        Selector(`#whitespace`).withExactText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-one-child`).withExactText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#deeply-nested-one-child`).withExactText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child`).withExactText(`foobar`).exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#deeply-nested-one-child-with-whitespace`).withExactText(`foobar`)
          .exists
      ).toBeResolvedTo(true);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withExactText(`foobar`).exists
      ).toBeResolvedTo(false);

      // `Space at end:`
      await expectAsync(
        Selector(`#whitespace`).withExactText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-one-child`).withExactText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#deeply-nested-one-child`).withExactText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child`).withExactText(`foobar `).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#deeply-nested-one-child-with-white-space`).withExactText(
          `foobar `
        ).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child-with-white-space`).withExactText(`foobar `)
          .exists
      ).toBeResolvedTo(false);

      // `On one of two children:`
      await expectAsync(
        Selector(`#nested-two-child`).withExactText(`foo`).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withExactText(`foo`).exists
      ).toBeResolvedTo(false);

      // `Substring across two children:`
      await expectAsync(
        Selector(`#nested-two-child`).withExactText(`ooba`).exists
      ).toBeResolvedTo(false);
      await expectAsync(
        Selector(`#nested-two-child-with-whitespace`).withExactText(`ooba`).exists
      ).toBeResolvedTo(false);
    });
  });
});
