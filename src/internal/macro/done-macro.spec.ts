import { SugarcubeParser } from '../../sugarcube-parser';
import { Selector } from '../../test-api/selector';

fdescribe(`Done Macro`, () => {
  it('runs on the current page', async () => {
    const passages = [
      {
        title: 'passage 1',
        tags: ['passage tag'],
        text: 'passage 1 <<button "Next Passage" "passage 2">><</button>>',
      },
      {
        title: 'passage 2',
        tags: ['passage tag'],
        text: 'passage 2 <<button "Next Passage" "passage 3">><</button>>',
      },
      {
        title: 'passage 3',
        tags: ['passage tag'],
        text: 'passage 3 <<button "Next Passage" "passage 4">><</button>>',
      },
      {
        title: 'passage 4',
        tags: ['passage tag'],
        text: 'passage 4 <div id="visited-passages"></div>',
      },
      {
        title: 'PassageDone',
        tags: [],
        text: `
        <<if $("#visited-passages").length === 0>>
            <<done>>
                <<script>>
                    State.variables.visitedPassages.push(passage());
                <</script>>
            <</done>>
        <<else>>
            <<done>>
                <<script>>
                    $("#visited-passages").text(State.variables.visitedPassages.toString())
                <</script>>
            <</done>>
        <</if>>
          `,
      },
      {
        title: 'StoryInit',
        tags: [],
        text: `
    <<script>>
        console.log('StoryInit');
    <</script>>
    <<set $visitedPassages = []>>
          `,
      },
    ];

    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await sugarcubeParser.testController
    .goto('passage 1')
    .expect(Selector(`.passage`).innerText)
    .contains(`passage 1`)
    .click(Selector(`button`).withText(`Next Passage`))
    .expect(Selector(`.passage`).innerText)
    .contains(`passage 2`)
    .click(Selector(`button`).withText(`Next Passage`))
    .expect(Selector(`.passage`).innerText)
    .contains(`passage 3`)
    .click(Selector(`button`).withText(`Next Passage`))
    .expect(Selector(`.passage`).innerText)
    .contains(`passage 4`)
    .expect(Selector(`#visited-passages`).innerText)
    .eql(`passage 1,passage 2,passage 3`)
  });
});
