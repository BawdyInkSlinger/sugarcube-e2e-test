import jQuery from 'jquery';
import L10n from '../l10n';
import { Macro } from '../macro/macro';
import { Scripting } from '../scripting';
import { Wikifier } from '../wikifier';
import { Config } from '../config';
import { DEBUG, DEBUG_PASSAGES, TWINE1 } from '../../constants';
import { SimpleStore } from '../simplestore';
import { InMemoryStorageAdapter } from './in-memory-storage-adapter';
import { Engine } from './engine';
import { Passage, PassageClass } from './passage';
import { SessionContainer } from './session';
import { StorageContainer } from './storage';
import { Alert } from '../alert';
import { SimplePassage } from '../declarations/unofficial/simple-passage';
import { sameValueZero } from '../samevaluezero';

let storyPassages: Passage[] = [];

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

  lookup(key: string | number, value: unknown  /* legacy */, sortKey = 'name'/* /legacy */) {
		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		return filter(passage => {
			// Objects (sans `null`).
			if (typeof passage[key] === 'object' && passage[key] !== null) {
				// The only object type currently supported is `Array`, since the
				// non-method `Passage` object properties currently yield only either
				// primitives or arrays.
				return passage[key] instanceof Array && passage[key].some(m => sameValueZero(m, value));
			}

			// All other types (incl. `null`).
			return sameValueZero(passage[key], value);
		})
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	},

	lookupWith(predicate /* legacy */, sortKey = 'name'/* /legacy */) {
		if (typeof predicate !== 'function') {
			throw new TypeError('Story.lookupWith predicate parameter must be a function');
		}

		/* eslint-disable eqeqeq, no-nested-ternary, max-len */
		return filter(predicate)
			.sort((a, b) => a[sortKey] == b[sortKey] ? 0 : a[sortKey] < b[sortKey] ? -1 : +1); // lazy equality for null
		/* eslint-enable eqeqeq, no-nested-ternary, max-len */
	},
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

let storyScripts: string[] = [];
let moduleScripts: string[] = [];

type Options = {
  passages: SimplePassage[];
  moduleScripts: string[];
  javascriptScripts: string[];
};
export const initialize = ({
  passages,
  moduleScripts: localModuleScripts,
  javascriptScripts,
}: Options) => {
  storyPassages = passages.map((simplePassage) => {
    if (DEBUG && DEBUG_PASSAGES) {
      console.log(
        `Initialize: passage found: \`${simplePassage.title}\` tags: \`${simplePassage.tags}\``
      );
    }
    return new PassageClass(simplePassage);
  });
  storyScripts = javascriptScripts.map((js: string) => {
    if (DEBUG && DEBUG_PASSAGES) {
      console.log(`Initialize: js found:\n${js}\n`);
    }
    return js;
  });
  moduleScripts = localModuleScripts;
  storyLoad();
};

const _inits: Passage[] = [];
const _widgets: Passage[] = [];
const _passages: Passage[] = [];
const _styles: Passage[] = [];
const _scripts: Passage[] = [];

// copied and modified from story.js
function storyLoad() {
  if (DEBUG) {
    console.log('[Story/storyLoad()]');
  }

  _inits.length = 0;
  _widgets.length = 0;
  _passages.length = 0;
  _styles.length = 0;
  _scripts.length = 0;

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
      return p.tags.includes('style');
    })
  );
  _scripts.push(
    ...storyPassages.filter((p) => {
      if (DEBUG && DEBUG_PASSAGES) {
        console.log(
          `title ${p.title}    p.tags.includes('script') ${p.tags.includes(
            'script'
          )}`
        );
      }
      return p.tags.includes('script');
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
        _inits.push(passage);
      } else if (passage.tags.includes('widget')) {
        validateSpecialPassages(passage, 'widget');
        _widgets.push(passage);
      }

      // All other passages.
      else {
        _passages.push(passage);
      }
    });

  start();
}

function start() {
  SimpleStore.adapters.push(InMemoryStorageAdapter);
  StorageContainer.storage = SimpleStore.create(Story.id, true); // eslint-disable-line no-undef
  SessionContainer.session = SimpleStore.create(Story.id, false); // eslint-disable-line no-undef

  moduleScripts.forEach((script) => {
    jQuery(function () {
      jQuery('<script>')
        .attr('type', 'text/javascript')
        .text(script)
        .appendTo('head');
    });
    // Scripting.evalJavaScript(script);
  });

  // primarily deals with StoryInterface Dom modifications
  Engine.init();

  storyScripts.forEach((script) => {
    // console.trace(`eval user script:\n`, script);
    Scripting.evalJavaScript(script);
  });
  // Run user scripts (user stylesheet, JavaScript, and widgets).
  // Engine.runUserScripts();
  _scripts.forEach((script) => {
    // console.trace(`eval script tag:\n`, script.text);
    Scripting.evalJavaScript(script.text);
  });
  _widgets.forEach((widget) => {
    Wikifier.wikifyEval(widget.processText());
  });

  L10n.init();

  Macro.init();
  // past this point is supposed to be in a Promise then() See sugarcube.js
  runStoryInit();
}

export function runStoryInit() {
  // Run the user init passages.
  // Engine.runUserInit();
  _inits.forEach((passage) => {
    Wikifier.wikifyEval(passage.text);
  });

  const storyInit = storyPassages.find((p) => p.title.trim() === 'StoryInit');
  if (storyInit) {
    // console.log(`############################################################################`, storyInit.text);
    Wikifier.wikifyEval(storyInit.text);
  }

  // Start the engine.
  Engine.start();

  // Trigger the `:storyready` global synthetic event.
  jQuery.event.trigger(':storyready');

  if (DEBUG) {
    console.log('[SugarCube/main()] Startup complete; story ready.');
  }
}