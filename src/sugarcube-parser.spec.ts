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

  it('has access to tags() in the passage', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'SugarcubeParser title',
          tags: ['SugarcubeParser tag'],
          text: `<<print tags()>>`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('SugarcubeParser title')
      .expect(Selector(`.passage`).innerText)
      .contains(`SugarcubeParser tag`);
  });
  
  it('has access to tags() in :passageend', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'SugarcubeParser title',
          tags: ['SugarcubeParser tag'],
          text: `<span id="tag-placeholder"></span>`,
        },
        {
          title: 'SugarcubeParser script',
          tags: ['script'],
          text: `
          $(document).on(':passageend', function (ev) {
            $("#tag-placeholder").append(tags());
          });`,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('SugarcubeParser title')
      .expect(Selector(`#tag-placeholder`).innerText)
      .eql(`SugarcubeParser tag`);
  });

  describe(`resetState`, () => {
    it(`retains access to the tags() function`, async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'SugarcubeParser title',
            tags: ['SugarcubeParser tag'],
            text: `<<print tags()>>`,
          },
        ],
      });

      sugarcubeParser.resetState('foo=bar');

      await sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .contains(`SugarcubeParser tag`);
    });
  });

  describe(`assignStateAndReload`, () => {
    it(`retains access to the tags() function`, async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'SugarcubeParser title',
            tags: ['SugarcubeParser tag'],
            text: `<<print tags()>>`,
          },
        ],
      });

      await sugarcubeParser.assignStateAndReload({}, `SugarcubeParser title`);
      await sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .contains(`SugarcubeParser tag`);
    });
  });

  describe(`resetState then assignStateAndReload`, () => {
    it(`retains access to the tags() function`, async () => {
      const sugarcubeParser = await SugarcubeParser.create({
        passages: [
          {
            title: 'SugarcubeParser title',
            tags: ['SugarcubeParser tag'],
            text: `<<print tags()>>`,
          },
        ],
      });

      sugarcubeParser.resetState('foo=bar');
      await sugarcubeParser.assignStateAndReload({}, `SugarcubeParser title`);

      await sugarcubeParser.testController
        .goto('SugarcubeParser title')
        .expect(Selector(`.passage`).innerText)
        .contains(`SugarcubeParser tag`);
    });
  });
});
