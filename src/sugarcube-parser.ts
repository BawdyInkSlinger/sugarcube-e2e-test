import _ from "lodash";
import fs from "fs/promises";
import { DOMWindow } from "jsdom";
import seedrandom from "seedrandom";
import { glob } from "glob";
import { SimplePassage } from "./internal/declarations/unofficial/simple-passage";
import prettier from "prettier";
import { setupJsdom } from "./internal/setup-jsdom";
import { setGlobal } from "./internal/set-global";
import { SugarCubeStoryVariables } from "./internal/declarations/unofficial/userdata";
import { SugarCubeTemporaryVariables } from "./internal/declarations/twine-sugarcube-copy/userdata";
import { TestController, testController } from "./test-api/test-controller";
import { DEBUG, DEBUG_PASSAGES } from "./constants";
import { waitForPassageEnd } from "./test-api/wait-for-passage-end";
import { setPassageLoadedHandler } from "./test-api/passage-loaded-handler";

declare global {
  interface Document {
    toPrettyString: () => Promise<string>;
  }
}

export class SugarcubeParser {
  passages: SimplePassage[];
  jQuery: JQueryStatic;
  Config: any;
  Macro: any;
  Setting: any;
  State: any;
  Engine: any;
  Save: any;
  Template: any;
  Story: any;
  initializeStory: any;
  javascriptContents: string[];

  private constructor(passages: SimplePassage[], javascriptContents: string[]) {
    this.passages = passages;
    this.jQuery = jQuery;
    this.Config = globalThis.Config;
    this.Macro = globalThis.Macro;
    this.Setting = globalThis.Setting;
    this.State = globalThis.State;
    this.Engine = globalThis.Engine;
    this.Save = globalThis.Save;
    this.Template = globalThis.Template;
    this.Story = globalThis.Story;
    this.initializeStory = globalThis.initializeStory;
    this.javascriptContents = javascriptContents;
  }

  static async create(
    setup: unknown,
    passages: SimplePassage[],
    customPassageLoadedHandler = waitForPassageEnd
  ): Promise<SugarcubeParser> {
    setPassageLoadedHandler(customPassageLoadedHandler);

    const { document, window } = await SugarcubeParser.load();
    // console.log('*************************************')
    // console.log(document);
    // console.log('*************************************')

    window.alert = (s: string) => {
      console.error(`ALERT: \`${s}\``);
    };

    setGlobal("scroll", () => {});
    setGlobal("_", _);

    const jQuery = await import("jquery");
    setGlobal("$", jQuery.default);
    setGlobal("jQuery", jQuery.default);

    await import("./internal/ecmascript-polyfills");
    await import("./internal/ecmascript-extensions");
    await import("./internal/jquery-plugins");

    const { clone } = await import("./internal/clone");
    setGlobal("clone", clone);

    await import("./internal/fakes/tempvariables");

    (Math as any).seedrandom = seedrandom;

    const { Config } = await import("./internal/config");
    setGlobal("Config", Config);

    const { Macro } = await import("./internal/macro/macro");
    setGlobal("Macro", Macro);

    setGlobal("setup", setup); // doesn't seem to be required
    // but if gameSetup isn't manually created, errors. Passing it in prevents tree-shaking(?)

    await import("./internal/macro/macrolib");

    const { Wikifier }: any = await import("./internal/wikifier");
    setGlobal("Wikifier", Wikifier);

    const { appendError } = await import("./internal/appenderror");
    setGlobal("appendError", appendError);

    const { Setting } = await import("./internal/fakes/setting");
    setGlobal("Setting", Setting);

    const { State } = await import("./internal/state");
    setGlobal("State", State);

    const { Engine } = await import("./internal/fakes/engine");
    setGlobal("Engine", Engine);

    const { Save } = await import("./internal/fakes/save");
    setGlobal("Save", Save);

    const { Template } = await import("./internal/template");
    setGlobal("Template", Template);

    setGlobal("settings", {});

    const {
      initialize: initializeStory,
      runStoryInit,
      Story,
    } = await import("./internal/fakes/story");

    setGlobal("Story", Story);
    setGlobal("initializeStory", initializeStory);
    setGlobal("runStoryInit", runStoryInit);

    const moduleFiles = await glob(["modules/*.js"], {
      ignore: "node_modules/**",
    });
    const moduleContents = await Promise.all(
      moduleFiles.map(async (path) => {
        if (DEBUG && DEBUG_PASSAGES) {
          console.log(`Found moduleFile: ${path}`);
        }
        return (await fs.readFile(path)).toString();
      })
    );

    const jsFiles = await glob(
      ["exposed_sugarcube_variables/*.js", "story/*.js"],
      { ignore: "node_modules/**" }
    );
    const javascriptContents = await Promise.all(
      jsFiles.map(async (path) => {
        if (DEBUG && DEBUG_PASSAGES) {
          console.log(`Found jsFile: ${path}`);
        }
        return (await fs.readFile(path)).toString();
      })
    );

    globalThis.dataLayer = [];

    initializeStory({
      passages: passages,
      moduleScripts: moduleContents,
      javascriptScripts: javascriptContents,
    });

    return new SugarcubeParser(passages, javascriptContents);
  }

  private static async load(): Promise<{
    window: DOMWindow;
    document: Document;
  }> {
    const sugarcubeHtml = (
      await fs.readFile(`${__dirname}/internal/html.tpl`)
    ).toString();
    const jsdom = setupJsdom(sugarcubeHtml, {
      url: "http://localhost",
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
    });

    return new Promise((resolve) => {
      jsdom.window.addEventListener("load", () => {
        const { window: jsdomWindow } = jsdom;
        const { document: jsdomDocument } = jsdomWindow;

        jsdomDocument.toPrettyString = function (): Promise<string> {
          return prettier.format(document.documentElement.outerHTML, {
            parser: "html",
          });
        };

        resolve({
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

  resetState(): void {
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
    DEBUG && console.log(`assignStateAndReload: currentTitle=`, currentTitle);
    if (currentTitle) {
      await testController.goto(currentTitle);
    }
  }
}
