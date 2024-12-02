import './test-api/internal/monkey-patching/jsdom/strings';
import { Selector, SugarcubeParser } from '.';
import {
  ResourceLoaderConstructorOptions,
  ResourceLoader,
  AbortablePromise,
  FetchOptions,
} from 'jsdom';

describe('SugarcubeParser', () => {
  it('can be created and goto a passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'SugarcubeParser title',
          tags: ['SugarcubeParser tag'],
          text: 'SugarcubeParser text',
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('SugarcubeParser title')
      .expect(Selector(`.passage`).innerText)
      .contains(`SugarcubeParser text`)
      .expect(Selector(`.passage`).innerText)
      .notContains(`SugarcubeParser t3xt`);
  });

  it('can use macros in subsequent SugarcubeParser.create calls', async () => {
    await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: 'abc',
        },
      ],
    });

    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<<button "Button">><</button>>',
        },
      ],
    });

    await sugarcubeParser.testController.goto('passage title');
  });

  it('can assign state and reload', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: 'variable=$variable temporary=_temporary',
        },
        {
          title: 'passage title2',
          tags: ['passage tag2'],
          text: 'variable2=$variable temporary=_temporary',
        },
      ],
    });

    // $variable not set, _temporary not set
    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql('variable=$variable temporary=_temporary');

    // $variable set, _temporary set
    await sugarcubeParser.assignStateAndReload(
      { 'variable': '123' },
      'passage title2',
      { 'temporary': '456' }
    );
    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql('variable2=123 temporary=456');

    // unset $variable, unset _temporary
    await sugarcubeParser.assignStateAndReload(
      { 'variable': undefined },
      'passage title2'
    );
    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql('variable2=$variable temporary=_temporary');
  });

  it('uses the ResourceLoader', async () => {
    let lastUrl: string | undefined;
    class ResourceLoaderStub extends ResourceLoader {
      fetch(
        url: string,
        options: FetchOptions
      ): AbortablePromise<Buffer> | null {
        lastUrl = url;
        return null;
      }
    }

    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: '<iframe src="https://www.google.com">A link to Google</iframe>',
        },
      ],
      resourceLoader: new ResourceLoaderStub(),
    });

    await sugarcubeParser.testController.goto('passage title');

    expect(lastUrl).toEqual(`https://www.google.com/`);
  });

  it('gives a useful error if the start passage does not exist', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'passage title',
          tags: ['passage tag'],
          text: `foobar`,
        },
      ],
    });

    try {
      await sugarcubeParser.assignStateAndReload(
        { 'variable': '123' },
        'foobar'
      );
      fail(`Error expected`);
    } catch (parentError) {
      expect(parentError.message).toEqual('Goto error');

      const childError = parentError.cause;
      expect(childError.message).toMatch(/does not exist/);
      expect(childError.message).toMatch(/foobar/);

      const grandchildError = childError.cause;
      expect(grandchildError).toBeUndefined();
    }
  });

  describe(`resetState`, () => {
    it(`resets variables`, async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: 'variable=$variable temporary=_temporary',
          },
        ],
      });

      await sugarcubeParser.testController
        .goto('passage title')
        .expect(Selector(`.passage`).innerText)
        .eql('variable=$variable temporary=_temporary');

      // $variable set, _temporary set
      await sugarcubeParser.assignStateAndReload(
        { 'variable': '123' },
        'passage title',
        { 'temporary': '456' }
      );

      sugarcubeParser.resetState();

      // $variable not set, _temporary not set
      expect(sugarcubeParser.State.variables[`variable`]).not.toBeDefined();
      expect(sugarcubeParser.State.temporary[`temporary`]).not.toBeDefined();
    });

    it(`does NOT clear passages`, async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'passage title',
            tags: ['passage tag'],
            text: 'passage text',
          },
        ],
      });

      function getPassageCount() {
        return globalThis.Story.lookupWith(() => true).map((p) => p.title)
          .length;
      }

      expect(getPassageCount()).toEqual(1);

      sugarcubeParser.resetState();

      expect(getPassageCount()).toEqual(1);
    });
  });
});
