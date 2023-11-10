/***********************************************************************************************************************

	passage.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, State, Wikifier, createSlug, decodeEntities, encodeMarkup, enumFrom */

import { Config } from '../config';
import { createSlug } from '../createslug';
import { SimplePassage } from '../declarations/unofficial/simple-passage';
import L10n from '../l10n';
import { State } from '../state';
import { Wikifier } from '../wikifier';
import { TWINE1 } from '../../constants';
import { Util } from '../util';

export const PassageClass = (() => {
  // eslint-disable-line no-unused-vars, no-var
  let _tagsToSkip;
  let _twine1Unescape;

  /*
		Tags which should not be transformed into classes:
			debug      → special tag
			nobr       → special tag
			passage    → the default class
			script     → special tag (only in Twine 1)
			stylesheet → special tag (only in Twine 1)
			twine.*    → special tag
			widget     → special tag
	*/
  // For Twine 1
  if (TWINE1) {
    _tagsToSkip =
      /^(?:debug|nobr|passage|script|stylesheet|widget|twine\..*)$/i;
  }
  // For Twine 2
  else {
    _tagsToSkip = /^(?:debug|nobr|passage|widget|twine\..*)$/i;
  }

  // For Twine 1
  if (TWINE1) {
    /*
			Returns a decoded version of the passed Twine 1 passage store encoded string.
		*/
    const _twine1EscapesRe = /(?:\\n|\\t|\\s|\\|\r)/g;
    const _hasTwine1EscapesRe = new RegExp(_twine1EscapesRe.source); // to drop the global flag
    const _twine1EscapesMap = Util.toEnum({
      '\\n': '\n',
      '\\t': '\t',
      '\\s': '\\',
      '\\': '\\',
      '\r': '',
    });

    _twine1Unescape = function (str) {
      if (str == null) {
        // lazy equality for null
        return '';
      }

      const val = String(str);
      return val && _hasTwine1EscapesRe.test(val)
        ? val.replace(_twine1EscapesRe, (esc) => _twine1EscapesMap[esc])
        : val;
    };
  }

  /*******************************************************************************
		Passage Class.
	*******************************************************************************/

  class PassageClass {
    declare id: string;
    declare domId: string;
    declare name: string;
    declare title: string;
    declare text: string;
    declare tags: string[];
    declare classes: string[];

    constructor({title, text, tags}: SimplePassage) {
      const sortedAndUniqueTags = [...new Set<string>(tags)].sort((a, b) =>
        a.localeCompare(b)
      );

      const id = `passage-${createSlug(title)}`;
      const name = Util.entityDecode(title);
      this.#construct(id, name, text, sortedAndUniqueTags);
    }

    // I extracted this private method to rename sortedAndUniqueTags -> tags and prevent the possibility of unsorted tag being used accidentally
    #construct(
      id: string,
      name: string,
      text: string,
      tags: string[]
    ) {
      Object.defineProperties(this, {
        // Passage title.
        name: {
          value: name,
        },
        
        text: {
          value: text,
        },

        // Passage tags array (unique).
        tags: {
          value: tags,
        },

        // Passage DOM-compatible ID.
        id: {
          value: id,
        },

        // Passage classes array (sorted and unique).
        classes: {
          value: Object.freeze(
            tags.length === 0
              ? []
              : (() =>
                  // Return the sorted list of unique classes.
                  tags
                    .filter((tag) => !_tagsToSkip.test(tag))
                    .map((tag) => createSlug(tag)))()
          ),
        },

        /* legacy */
        domId: {
          value: id,
        },
        title: {
          value: name,
        },
        /* /legacy */
      });
    }

    // Getters.
    get className() {
      return this.classes.join(' ');
    }

    // TODO: (v3) This should be → `get text`.
    processText() {
      // Handle image passage transclusion.
      if (this.tags.includes('Twine.image')) {
        return `[img[${this.text}]]`;
      }

      let processed = this.text;

      // Handle `Config.passages.onProcess`.
      if (Config.passages.onProcess) {
        processed = Config.passages.onProcess.call(null, {
          title: this.name,
          tags: this.tags,
          text: processed,
        });
      }

      // Handle `Config.passages.nobr` and the `nobr` tag.
      if (Config.passages.nobr || this.tags.includes('nobr')) {
        // Remove all leading & trailing newlines and compact all internal sequences
        // of newlines into single spaces.
        processed = processed.replace(/^\n+|\n+$/g, '').replace(/\n+/g, ' ');
      }

      return processed;
    }

    render(options?) {
      const frag = document.createDocumentFragment();
      new Wikifier(frag, this.processText(), options);
      return frag;
    }

    /* legacy */
    description() {
      // eslint-disable-line class-methods-use-this
      return `${L10n.get('turn')} ${State.turns}`;
    }
    /* /legacy */
  }

  /*******************************************************************************
		Object Exports.
	*******************************************************************************/

  return PassageClass;
})();

export type Passage = InstanceType<typeof PassageClass>;