import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';

describe(`click`, () => {
  it('can click a button that renders a new passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<h1>Passage 1</h1><<button "Button" "passage 2">><</button>>`,
        },
        {
          title: 'passage 2',
          tags: ['passage tag'],
          text: '<h1>Passage 2</h1>',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage h1`).innerText)
      .eql(`Passage 1`)
      .click(Selector('.passage button'))
      .expect(Selector(`.passage h1`).innerText)
      .eql(`Passage 2`);
  });

  it('can click a button without rendering a new passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<button "Button">>
            <<replace '#status'>>clicked<</replace>>
          <</button>>
          <div id="status">pending</div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`#status`).innerText)
      .eql(`pending`)
      .click(Selector('.passage button'), { waitFor: 'click end' })
      .expect(Selector(`#status`).innerText)
      .eql(`clicked`);
  });

  it('gives a useful error if you wait for passage end (default click strategy) but the click does not render a new passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `<<button "Button">>
              <<replace '#status'>>clicked<</replace>>
            <</button>>
            <div id="status">pending</div>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`#status`).innerText)
      .eql(`pending`);

    await expectAsync(
      sugarcubeParser.testController.click(Selector('.passage button'))
    ).toBeRejectedWithError(/:passageend/);
  });

  /**
   * TODO: This test needs to pass! It exposes a bug.
   *
   * There's a challenging chicken before the egg situation here:
   * If TestController.click waits for a :passageend, it needs to start listening before the actual click.
   * I don't think that is currently happening, but it's difficult to notice because the race
   * condition *usually* goes down the happy path; for some reason, creating
   * the `const waitUntil` early makes a huge difference. If you put it at the end of `const asyncClick`
   * it fails more often.
   *
   * Here's how I think the code needs to change:
   * 1. Early in `const asyncClick`, check if the selector exists on the page
   * 2. If it does not exist, throw an error.
   * 3.
   *     a. If it does exist and the wait strategy is ':passageend', wait for the
   *         event and timeout if it never occurs.
   *     b. Click the selector
   * 4.
   *     a. If it does exist and the wait strategy is 'click end', click the selector
   *     b. wait a millisecond to prevent the next action in the promise chain from firing
   *         before the click has had a chance to modify the DOM (not sure if this is required,
   *         but better safe than sorry).
   * 
   * I think this refactoring may require in lining the `buildWaitStrategy` code, because the behavior
   * is very different between the two. 
   *
   * To get the test(s) consistently fail, run jasmine this way:
   * jasmine --random=true --seed=25942
   *
   * To get the test(s) consistently pass, run jasmine this way:
   * jasmine --random=true --seed=20222
   */
  //   it('gives a useful error if the selector cannot be found', async () => {
  //     const sugarcubeParser = await SugarcubeParser.create({
  //       passages: [
  //         {
  //           title: 'passage title',
  //           tags: ['passage tag'],
  //           text: `<h1>Passage 1</h1><<button "Button" "passage 2">><</button>>`,
  //         },
  //         {
  //           title: 'passage 2',
  //           tags: ['passage tag'],
  //           text: '<h1>Passage 2</h1>',
  //         },
  //       ],
  //     });

  //     await sugarcubeParser.testController
  //       .goto('passage title')
  //       .expect(Selector(`.passage h1`).innerText)
  //       .eql(`Passage 1`);

  //     await expectAsync(
  //       sugarcubeParser.testController.click(Selector('.passage button').withText('foobar'))
  //     ).toBeRejectedWithError(
  //       'Attempted to click on selector that could not be found: Selector(`.passage button:contains(foobar)`)'
  //     );
  //   });

  /*
in another test: error when .expect(Selector(`#status`).innerText) cannot be found
  */
});
