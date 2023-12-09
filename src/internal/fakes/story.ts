import jQuery from 'jquery';
import { Macro } from '../macro/macro';
import { Scripting } from '../scripting';
import { Wikifier } from '../wikifier';
import { SimpleStore } from '../simplestore';
import { InMemoryStorageAdapter } from './in-memory-storage-adapter';
import { Engine } from './engine';
import { Passage, PassageClass } from './passage';
import { SessionContainer } from './session';
import { StorageContainer } from './storage';
import { SimplePassage } from '../declarations/unofficial/simple-passage';
import { getLogger } from '../../logger';
import { L10n } from '../l10n';
import { Util } from '../util';

let storyPassages: Passage[] = [];
const logger = getLogger('DEFAULT');
const passageLogger = getLogger('DEBUG_PASSAGES');
const evalLogger = getLogger('DEBUG_EVAL');

const _inits: Passage[] = [];
const _widgets: Passage[] = [];
const _passages: Passage[] = [];
const _styles: Passage[] = [];
const _scripts: Passage[] = [];

export const Story = {
  id: 'fakeStoryId',
  domId: 'fakeStoryDomId',
  title: 'fakeStoryTitle',
  name: 'fakeStoryName',

  /**
   * Returns the Passage object referenced by the given title, or an empty Passage object on failure.
   * @param passageTitle The title of the Passage object to return.
   * @since 2.0.0
   */
  get(passageTitle: string): Passage {
    return storyPassages.find((p) => {
      return p.title === passageTitle;
    });
  },

  /**
   * Returns whether a Passage object referenced by the given title exists.
   * @param passageTitle The title of the Passage object whose existence will be verified.
   * @since 2.0.0
   */
  has(passageTitle: string): boolean {
    return (
      storyPassages.find((p) => {
        return p.title === passageTitle;
      }) !== undefined
    );
  },

  lookup(
    key: string | number,
    value: unknown /* legacy */,
    sortKey = 'name' /* /legacy */
  ) {
    /* eslint-disable eqeqeq, no-nested-ternary, max-len */
    return filter((passage) => {
      // Objects (sans `null`).
      if (typeof passage[key] === 'object' && passage[key] !== null) {
        // The only object type currently supported is `Array`, since the
        // non-method `Passage` object properties currently yield only either
        // primitives or arrays.
        return (
          passage[key] instanceof Array &&
          passage[key].some((m) => Util.sameValueZero(m, value))
        );
      }

      // All other types (incl. `null`).
      return Util.sameValueZero(passage[key], value);
    }).sort((a, b) =>
      a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1
    ); // lazy equality for null
    /* eslint-enable eqeqeq, no-nested-ternary, max-len */
  },

  lookupWith(predicate /* legacy */, sortKey = 'name' /* /legacy */) {
    if (typeof predicate !== 'function') {
      throw new TypeError(
        'Story.lookupWith predicate parameter must be a function'
      );
    }

    /* eslint-disable eqeqeq, no-nested-ternary, max-len */
    return filter(predicate).sort((a, b) =>
      a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1
    ); // lazy equality for null
    /* eslint-enable eqeqeq, no-nested-ternary, max-len */
  },

  reset() {
    SimpleStore.adapters.length = 0;
    SimpleStore.adapters.push(InMemoryStorageAdapter);
    StorageContainer.storage = SimpleStore.create(Story.id, true); // eslint-disable-line no-undef
    SessionContainer.session = SimpleStore.create(Story.id, false); // eslint-disable-line no-undef
  
    _inits.length = 0;
    _widgets.length = 0;
    _passages.length = 0;
    _styles.length = 0;
    _scripts.length = 0;
  }
};

function filter(predicate: (passage: Passage) => boolean, thisArg?: undefined) {
  if (typeof predicate !== 'function') {
    throw new TypeError('Story.filter predicate parameter must be a function');
  }

  const results = [];

  for (let i = 0, keys = Object.keys(_passages); i < keys.length; ++i) {
    const passage = _passages[keys[i]];

    if (predicate.call(Object(thisArg), passage)) {
      results.push(passage);
    }
  }

  return results;
}

type Script = { path: string; content: string };

type Options = {
  passages: SimplePassage[];
  moduleScripts: Script[];
  nonmoduleScripts: Script[];
};
export const initialize = ({
  passages,
  moduleScripts,
  nonmoduleScripts,
}: Options) => {

  storyPassages = passages.map((simplePassage) => {
    passageLogger.debug(
      `Twee passage found: \`${simplePassage.title}\` tags: \`${simplePassage.tags}\``
    );
    return new PassageClass(simplePassage);
  });

  storyLoad(moduleScripts, nonmoduleScripts);
};

// copied and modified from story.js
function storyLoad(moduleScripts: Script[], storyScripts: Script[]) {
  logger.debug('[Story/storyLoad()]');

  const validationCodeTags = ['init', 'widget'];
  const validationNoCodeTagPassages = [
    'PassageDone',
    'PassageFooter',
    'PassageHeader',
    'PassageReady',
    'StoryAuthor',
    'StoryBanner',
    'StoryCaption',
    'StoryInit',
    'StoryMenu',
    'StoryShare',
    'StorySubtitle',
  ];

  function validateStartingPassage(passage) {
    if (passage.tags.includesAny(validationCodeTags)) {
      throw new Error(
        `starting passage "${
          passage.name
        }" contains special tags; invalid: "${passage.tags
          .filter((tag) => validationCodeTags.includes(tag))
          .sort()
          .join('", "')}"`
      );
    }
  }

  function validateSpecialPassages(passage, ...tags) {
    if (validationNoCodeTagPassages.includes(passage.name)) {
      throw new Error(
        `special passage "${
          passage.name
        }" contains special tags; invalid: "${tags.sort().join('", "')}"`
      );
    }

    const codeTags = Array.from(validationCodeTags);
    const foundTags = [];

    passage.tags.forEach((tag) => {
      if (codeTags.includes(tag)) {
        foundTags.push(...codeTags.delete(tag));
      }
    });

    if (foundTags.length > 1) {
      throw new Error(
        `passage "${
          passage.name
        }" contains multiple special tags; invalid: "${foundTags
          .sort()
          .join('", "')}"`
      );
    }
  }

  _styles.push(
    ...storyPassages.filter((p) => {
      const match = p.tags.includes('style');
      if (match) {
        passageLogger.info(`assigning ${p.title} to _style`);
      }

      return match;
    })
  );
  _scripts.push(
    ...storyPassages.filter((p) => {
      const match = p.tags.includes('script');
      if (match) {
        passageLogger.info(`assigning ${p.title} to _scripts`);
      }

      return match;
    })
  );

  // Engine.play(startingPassage, true);

  storyPassages
    .filter((p) => {
      return !p.tags.includes('style') && !p.tags.includes('script');
    })
    .forEach((passage) => {
      if (passage.tags.includes('init')) {
        validateSpecialPassages(passage, 'init');
        passageLogger.info(`assigning ${passage.title} to _inits`);
        _inits.push(passage);
      } else if (passage.tags.includes('widget')) {
        validateSpecialPassages(passage, 'widget');
        passageLogger.info(`assigning ${passage.title} to _widgets`);
        _widgets.push(passage);
      }

      // All other passages.
      else {
        passageLogger.debug(`assigning ${passage.title} to _passage`);
        _passages.push(passage);
      }
    });

  start(moduleScripts, storyScripts);
}

function start(moduleScripts: Script[], storyScripts: Script[]) {
  moduleScripts.forEach((script) => {
    evalLogger.info(`evaluating moduleScripts element named ${script.path}`);
    Scripting.evalJavaScript(script.content);
  });

  // primarily deals with StoryInterface Dom modifications
  Engine.init();

  // Run story scripts (dialog.js, click-to-proceed.js, speech.js).
  storyScripts.forEach((script) => {
    evalLogger.info(`evaluating storyScripts element named ${script.path}`);
    Scripting.evalJavaScript(script.content);
  });
  // Run user scripts (user stylesheet, JavaScript, and widgets).
  // Engine.runUserScripts();
  _scripts.forEach((script) => {
    evalLogger.info(`evaluating _scripts element named ${script.title}`);
    Scripting.evalJavaScript(script.text);
  });
  _widgets.forEach((widget) => {
    evalLogger.info(`evaluating _widget element named ${widget.title}`);
    Wikifier.wikifyEval(widget.processText());
  });

  L10n.init();

  Macro.init();
  // past this point is supposed to be in a Promise then() See sugarcube.js
  runStoryInit();
}

export function runStoryInit() {
  logger.debug(`runStoryInit()`);
  // Run the user init passages.
  // Engine.runUserInit();
  _inits.forEach((passage) => {
    passageLogger.info(`evaluating _inits element named ${passage.title}`);
    Wikifier.wikifyEval(passage.text);
  });

  const storyInit = storyPassages.find((p) => p.title.trim() === 'StoryInit');
  if (storyInit) {
    passageLogger.info(
      `evaluating StoryInit passage '${storyInit.title}'` +
        (passageLogger.isDebugEnabled() ? ` text=\n${storyInit.text}` : '')
    );
    Wikifier.wikifyEval(storyInit.text);
  }

  // Start the engine.
  Engine.start();

  // Trigger the `:storyready` global synthetic event.
  jQuery.event.trigger(':storyready');

  logger.debug('[SugarCube/main()] Startup complete; story ready.');
}
