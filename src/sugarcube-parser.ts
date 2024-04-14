import _ from 'lodash';
import fs from 'fs/promises';
import { DOMWindow, JSDOM, ResourceLoader } from 'jsdom';
import seedrandom from 'seedrandom';
import { SimplePassage } from './internal/declarations/unofficial/simple-passage';
import { setupJsdom } from './internal/setup-jsdom';
import { resetGlobal } from './internal/reset-global';
import { SugarCubeStoryVariables } from './internal/declarations/unofficial/userdata';
import { SugarCubeTemporaryVariables } from './internal/declarations/twine-sugarcube-copy/userdata';
import { TestController, testController } from './test-api/test-controller';
import { getLogger } from './logging/logger';
import { addToPrettyString } from './add-to-pretty-string';
import { clearTimeouts } from './trigger-timeout';
import type { State } from './internal/state';
import jQueryFactory from 'jquery';
import {} from 'node:path';

const logger = getLogger('DEFAULT');
const passagesLogger = getLogger('DEBUG_PASSAGES');
const baseUrl = 'http://localhost';

export type SugarcubeParserOptions = {
  passages: SimplePassage[];
  resourceLoader?: ResourceLoader | 'usable';
//   customPassageLoadedHandler?: (debugNote: string) => Promise<void>;  TODO: turn TestController into a class so this (and timeoutMillis, for eg) can be passed into it?
  moduleScripts?: string[];
  sugarcubeScripts?: string[];
};

export class SugarcubeParser {
  jQuery: JQueryStatic;
  Config: any;
  Macro: any;
  Setting: any;
  State: typeof State;
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

  static async create({
    passages,
    // customPassageLoadedHandler = waitForPassageEnd,  TODO: turn TestController into a class so this (and timeoutMillis, for eg) can be passed into it?
    resourceLoader = 'usable',
    moduleScripts = [],
    sugarcubeScripts = [],
  }: SugarcubeParserOptions): Promise<SugarcubeParser> {
    clearTimeouts(); // This could prevent parallel test runs?
    // setPassageLoadedHandler(customPassageLoadedHandler); TODO: turn TestController into a class so this (and timeoutMillis, for eg) can be passed into it?

    const { jsdom, document, window } =
      await SugarcubeParser.load(resourceLoader);
    const jQuery = jQueryFactory(window);

    resetGlobal('window', window);
    resetGlobal('console', console);
    resetGlobal('document', document);
    resetGlobal('jsdom', jsdom);

    resetGlobal('$', jQuery);
    resetGlobal('jQuery', jQuery);

    window.alert = (s: string) => {
      console.error(`ALERT: \`${s}\``);
    };

    resetGlobal('scroll', () => {});
    resetGlobal('_', _);

    resetGlobal('setup', {});

    const { initialize: initializeJQueryExtensions } = await import(
      './internal/extensions'
    );
    if (globalThis['initializeJQueryExtensions'] === undefined) {
      initializeJQueryExtensions();
      resetGlobal('initializeJQueryExtensions', initializeJQueryExtensions);
    }

    const { initialize: initializeJQueryPlugins } = await import(
      './internal/jquery-plugins'
    );
    initializeJQueryPlugins();

    const { initialize: initializeTempVariables } = await import(
      './internal/fakes/tempvariables'
    );
    initializeTempVariables();

    (Math as any).seedrandom = seedrandom;

    const { Config } = await import('./internal/config');
    resetGlobal('Config', Config);

    const { Macro } = await import('./internal/macro/macro');
    resetGlobal('Macro', Macro);

    const { initialize: initializeMacroLibs } = await import(
      './internal/macro/macrolib'
    );
    initializeMacroLibs();

    const { Wikifier }: any = await import('./internal/wikifier');
    resetGlobal('Wikifier', Wikifier);
    const { initialize: initializeParserLibs } = await import(
      './internal/parserlib'
    );
    if (globalThis['initializeParserLibs'] === undefined) {
      initializeParserLibs();
      resetGlobal('initializeParserLibs', initializeParserLibs);
    }

    const { Setting } = await import('./internal/fakes/setting');
    resetGlobal('Setting', Setting);

    const { State } = await import('./internal/state');
    resetGlobal('State', State);

    const { Engine } = await import('./internal/fakes/engine');
    resetGlobal('Engine', Engine);

    const { Save } = await import('./internal/fakes/save');
    resetGlobal('Save', Save);

    const { Template } = await import('./internal/template');
    resetGlobal('Template', Template);

    resetGlobal('settings', {});

    const {
      initialize: initializeStory,
      runStoryInit,
      Story,
    } = await import('./internal/fakes/story');

    resetGlobal('Story', Story);
    resetGlobal('initializeStory', initializeStory);
    resetGlobal('runStoryInit', runStoryInit);

    const modules = await Promise.all(
      moduleScripts.map(async (path) => {
        passagesLogger.debug(`Found moduleFile: ${path}`);

        return { path, content: (await fs.readFile(path)).toString() };
      })
    );

    const javascripts = await Promise.all(
      sugarcubeScripts.map(async (path) => {
        passagesLogger.debug(`Found jsFile: ${path}`);

        return { path, content: (await fs.readFile(path)).toString() };
      })
    );

    resetGlobal('dataLayer', []);

    initializeStory({
      passages: passages,
      moduleScripts: modules,
      nonmoduleScripts: javascripts,
    });

    return new SugarcubeParser();
  }

  private static async load(resources: ResourceLoader | 'usable'): Promise<{
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
      resources,
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
    passageName?: string,
    temporaryVariables?: Partial<T>
  ): Promise<void> {
    Object.assign(globalThis.State.variables, variables);
    const currentTitle = passageName ?? globalThis.State.current?.title;
    logger.debug(`assignStateAndReload: currentTitle=${currentTitle}`);
    if (currentTitle) {
      await testController.goto(currentTitle, temporaryVariables);
    }
  }
}
