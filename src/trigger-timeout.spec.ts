import './test-api/internal/monkey-patching/jsdom/strings'
import { Selector, SugarcubeParser } from '.';
import {
  ResourceLoaderConstructorOptions,
  ResourceLoader,
  AbortablePromise,
  FetchOptions,
} from 'jsdom';

describe('Trigger Timeout', () => {
  it('can group timers and tell you how many are running', async () => {
    // const sugarcubeParser = await SugarcubeParser.create({
    //   passages: [
    //     {
    //       title: 'SugarcubeParser title',
    //       tags: ['SugarcubeParser tag'],
    //       text: 'SugarcubeParser text',
    //     },
    //   ],
    // });

    // await sugarcubeParser.testController
    //   .goto('SugarcubeParser title')
    //   .expect(Selector(`.passage`).innerText)
    //   .contains(`SugarcubeParser text`)
    //   .expect(Selector(`.passage`).innerText)
    //   .notContains(`SugarcubeParser t3xt`);
  });
});
