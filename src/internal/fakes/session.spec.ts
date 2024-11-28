import { SugarcubeParser } from '../../sugarcube-parser';
import { Selector } from '../../test-api/selector';

describe(`Session`, () => {
  it('can be used in passages', async () => {
    const passages = [
      {
        title: 'StoryInit',
        tags: [],
        text: '<<set $foo = 0>>',
      },
      {
        title: 'passage title',
        tags: ['passage tag'],
        text:
          '<<button "Increment" `passage()`>><<set $foo = $foo + 1>><</button>>\n$$foo = <span class="foo">$foo</span>' +
          '<<button "Reset" `passage()`>><<script>>setup.cleanStateAt("passage title");<</script>><</button>>',
      },
      {
        title: 'Script',
        tags: ['script'],
        text: `
setup.cleanStateAt = function (name) {
  session.delete('state');
  Config.passages.start = name;
}
            `,
      },
    ];

    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.foo`).innerText)
      .eql('0')
      .click(Selector(`button`).withText(`Increment`))
      .expect(Selector(`.foo`).innerText)
      .eql('1')
      .click(Selector(`button`).withText(`Increment`))
      .expect(Selector(`.foo`).innerText)
      .eql('2')
      .click(Selector(`button`).withText(`Increment`))
      // reset
      .click(Selector(`button`).withText(`Reset`)) // this will only work if called within StoryInit
      .expect(Selector(`.foo`).innerText)
      .eql('3')
      .click(Selector(`button`).withText(`Increment`))
      .expect(Selector(`.foo`).innerText)
      .eql('4');
  });
});
