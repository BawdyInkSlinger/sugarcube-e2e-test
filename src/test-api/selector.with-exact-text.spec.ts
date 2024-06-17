import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`selector withExactText`, () => {
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
      Selector(`#deeply-nested-one-child-with-whitespace`).withExactText(`foobar`).exists
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
      Selector(`#deeply-nested-one-child-with-whitespace`).withExactText(`foobar `).exists
    ).toBeResolvedTo(false);
    await expectAsync(
      Selector(`#nested-two-child-with-whitespace`).withExactText(`foobar `).exists
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
