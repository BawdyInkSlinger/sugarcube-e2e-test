import { Selector, SugarcubeParser } from '../src';
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
          text: 'abc=$abc',
        },
        {
          title: 'passage title2',
          tags: ['passage tag2'],
          text: 'abc2=$abc',
        },
      ],
    });

    // $abc not set
    await sugarcubeParser.testController
      .goto('passage title')
      .expect(Selector(`.passage`).innerText)
      .eql('abc=$abc');

    // $abc set
    await sugarcubeParser.assignStateAndReload(
      { 'abc': '123' },
      'passage title2'
    );
    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql('abc2=123');

    // unset $abc
    await sugarcubeParser.assignStateAndReload(
      { 'abc': undefined },
      'passage title2'
    );
    await sugarcubeParser.testController
      .expect(Selector(`.passage`).innerText)
      .eql('abc2=$abc');
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
});
