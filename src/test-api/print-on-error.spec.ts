import { SugarcubeParser } from '../sugarcube-parser';
import { Selector } from './selector';
import * as addtoprettystring from './../add-to-pretty-string';
import sinon, { SinonStub } from 'sinon';

describe(`Print On Error`, () => {
  const passages = {
    passages: [
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: `<h1>Passage 1</h1><<button "Button" "passage 2">><</button>><<button "Noop">><</button>>`,
      },
      {
        title: 'passage 2',
        tags: ['passage tag'],
        text: '<h1>Passage 2</h1>',
      },
    ],
  };
  let printError: SinonStub;

  beforeEach(() => {
    printError = sinon.stub(addtoprettystring, 'printError');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('prints the document when a click selector does not exist', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      ...passages,
      printOnError: {
        includeHeadElement: false,
        includeSvgBody: true,
        selectorsToRemove: ['body'],
      },
    });

    await sugarcubeParser.testController.goto('passage title');

    try {
      await sugarcubeParser.testController.click(
        Selector('.passage button').withText('foobar')
      );
      fail(`Error expected`);
    } catch (parentError) {
      expect(printError.calledOnce).toBeTrue();
    }
  });

  it('prints the document when an assertion fails', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      ...passages,
      printOnError: {
        includeHeadElement: false,
        includeSvgBody: true,
        selectorsToRemove: ['body'],
      },
    });

    await sugarcubeParser.testController.goto('passage title');

    try {
      await sugarcubeParser.testController
        .expect(Selector('.passage button').withText('Does not exist').exists)
        .ok();
      fail(`Error expected`);
    } catch (parentError) {
      expect(printError.calledOnce).toBeTrue();
    }
  });

  it('prints the document when a passage end does not occur', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      ...passages,
      printOnError: {
        includeHeadElement: false,
        includeSvgBody: true,
        selectorsToRemove: ['body'],
      },
    });

    await sugarcubeParser.testController.goto('passage title');

    try {
      await sugarcubeParser.testController.click(
        Selector('.passage button').withText('Noop')
      );
      fail(`Error expected`);
    } catch (parentError) {
      expect(printError.calledOnce).toBeTrue();
    }
  });

  it('does not print an error unless configured', async () => {
    const sugarcubeParser = await SugarcubeParser.create(passages);

    await sugarcubeParser.testController.goto('passage title');

    try {
      await sugarcubeParser.testController.click(
        Selector('.passage button').withText('foobar')
      );
      fail(`Error expected`);
    } catch (parentError) {
      expect(printError.called).toBeFalse();
    }
  });
});
