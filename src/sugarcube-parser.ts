import _ from 'lodash';
import fs from 'fs/promises';
import { DOMWindow, JSDOM } from 'jsdom';
import seedrandom from 'seedrandom';
import { glob } from 'glob';
import { SimplePassage } from './internal/declarations/unofficial/simple-passage';
import { setupJsdom } from './internal/setup-jsdom';
import { setGlobal } from './internal/set-global';
import { SugarCubeStoryVariables } from './internal/declarations/unofficial/userdata';
import { SugarCubeTemporaryVariables } from './internal/declarations/twine-sugarcube-copy/userdata';
import { TestController, testController } from './test-api/test-controller';
import { waitForPassageEnd } from './test-api/wait-for-passage-end';
import { setPassageLoadedHandler } from './test-api/passage-loaded-handler';
import { getLogger } from './logger';
import { addToPrettyString } from './add-to-pretty-string';

const logger = getLogger('DEFAULT');
const passagesLogger = getLogger('DEBUG_PASSAGES');
const baseUrl = 'http://localhost';

export class SugarcubeParser {
  jQuery: JQueryStatic;
  Config: any;
  Macro: any;
  Setting: any;
  State: any;
  Engine: any;
  Save: any;
  Template: any;
  Story: any;

  private constructor() {
    this.jQuery = jQuery;
    this.Config = globalThis.Config;
    this.Macro = globalThis.Macro;
    this.Setting = globalThis.Setting;
    this.State = globalThis.State;
    this.Engine = globalThis.Engine;
    this.Save = globalThis.Save;
    this.Template = globalThis.Template;
    this.Story = globalThis.Story;
  }

  static async create(
    passages: SimplePassage[],
    customPassageLoadedHandler = waitForPassageEnd
  ): Promise<SugarcubeParser> {
    setPassageLoadedHandler(customPassageLoadedHandler);

    const { jsdom, document, window } = await SugarcubeParser.load();
    setGlobal('console', console);
    setGlobal('window', window);
    setGlobal('document', document);
    setGlobal('jsdom', jsdom);

    window.alert = (s: string) => {
      console.error(`ALERT: \`${s}\``);
    };

    setGlobal('scroll', () => {});
    setGlobal('_', _);

    setGlobal('setup', {});

    const jQuery = await import('jquery');
    setGlobal('$', jQuery.default);
    setGlobal('jQuery', jQuery.default);

    await import('./internal/extensions');
    await import('./internal/jquery-plugins');

    await import('./internal/fakes/tempvariables');

    (Math as any).seedrandom = seedrandom;

    const { Config } = await import('./internal/config');
    setGlobal('Config', Config);

    const { Macro } = await import('./internal/macro/macro');
    setGlobal('Macro', Macro);

    await import('./internal/macro/macrolib');

    const { Wikifier }: any = await import('./internal/wikifier');
    setGlobal('Wikifier', Wikifier);
    await import('./internal/parserlib');

    const { Setting } = await import('./internal/fakes/setting');
    setGlobal('Setting', Setting);

    const { State } = await import('./internal/state');
    setGlobal('State', State);

    const { Engine } = await import('./internal/fakes/engine');
    setGlobal('Engine', Engine);

    const { Save } = await import('./internal/fakes/save');
    setGlobal('Save', Save);

    const { Template } = await import('./internal/template');
    setGlobal('Template', Template);

    setGlobal('settings', {});

    const {
      initialize: initializeStory,
      runStoryInit,
      Story,
    } = await import('./internal/fakes/story');

    setGlobal('Story', Story);
    setGlobal('initializeStory', initializeStory);
    setGlobal('runStoryInit', runStoryInit);

    const moduleFiles = await glob(['modules/*.js'], {
      ignore: 'node_modules/**',
    });
    const modules = await Promise.all(
      moduleFiles.map(async (path) => {
        passagesLogger.debug(`Found moduleFile: ${path}`);

        return { path, content: (await fs.readFile(path)).toString() };
      })
    );

    const jsFiles = await glob(
      ['exposed_sugarcube_variables/*.js', 'story/*.js'],
      { ignore: 'node_modules/**' }
    );
    const javascripts = await Promise.all(
      jsFiles.map(async (path) => {
        passagesLogger.debug(`Found jsFile: ${path}`);

        return { path, content: (await fs.readFile(path)).toString() };
      })
    );

    setGlobal('dataLayer', []);

    initializeStory({
      passages: passages,
      moduleScripts: modules,
      nonmoduleScripts: javascripts,
    });

    return new SugarcubeParser();
  }

  private static async load(): Promise<{
    window: DOMWindow;
    document: Document;
    jsdom: JSDOM;
  }> {
    const sugarcubeHtml = (
      await fs.readFile(`${__dirname}/internal/html.tpl`)
    ).toString();
    const jsdom = setupJsdom(sugarcubeHtml, {
      url: baseUrl,
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
    });

    return new Promise((resolve) => {
      jsdom.window.addEventListener('load', () => {
        const { window: jsdomWindow } = jsdom;
        const { document: jsdomDocument } = jsdomWindow;

        addToPrettyString(jsdomDocument);

        resolve({
          jsdom,
          window: jsdomWindow,
          document: jsdomDocument,
        });
      });
    });
  }

  get testController(): TestController {
    return testController;
  }

  get variables(): SugarCubeStoryVariables {
    return globalThis.State.variables;
  }

  get temporary(): SugarCubeTemporaryVariables {
    return globalThis.State.temporary;
  }

  resetState(urlParams = ''): void {
    logger.debug(`resetState(urlParams=\`${urlParams}\`)`);

    const url = baseUrl + (urlParams.length > 0 ? `?${urlParams}` : '');
    globalThis.jsdom.reconfigure({ url });

    globalThis.Engine.restart();
    globalThis.runStoryInit();
  }

  async assignStateAndReload<V = any, T = any>(
    variables: Partial<V>,
    temporary?: Partial<T>
  ): Promise<void> {
    Object.assign(globalThis.State.variables, variables);
    if (temporary) {
      Object.assign(globalThis.State.temporary, temporary);
    }
    const currentTitle = globalThis.State.current?.title;
    logger.debug(`assignStateAndReload: currentTitle=`, currentTitle);
    if (currentTitle) {
      await testController.goto(currentTitle);
    }
  }
}
