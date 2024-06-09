import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`setPageElement`, () => {
  it('replaces a passage element by ID', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<span id="foo">bar</span>
          <<button "Fill Span With Snippet">>
            <<run setPageElement("foo", "snippet")>>
          <</button>>`,
        },
        {
          title: 'snippet',
          tags: ['passage tag'],
          text: `baz`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector('#foo').innerText)
      .eql(`bar`)
      .click(Selector(`.passage button`).withText(`Fill Span With Snippet`), {
        waitFor: 'click end',
      })
      .expect(Selector('#foo').innerText)
      .eql(`baz`);
  });
});
