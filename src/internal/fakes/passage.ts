/***********************************************************************************************************************

	passage.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, L10n, Util, Wikifier */

import { title } from 'process';
import { TWINE1 } from '../../constants';
import { getLogger } from '../../logging/logger';
import { Config } from '../config';
import { SimplePassage } from '../declarations/unofficial/simple-passage';
import { L10n } from '../l10n';
import { Util } from '../util';
import { Wikifier } from '../wikifier';

const logger = getLogger();

export const PassageClass = (() => {
  // eslint-disable-line no-unused-vars, no-var
  'use strict';

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
    const _twine1EscapesMap = Object.freeze({
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

  /*******************************************************************************************************************
		Passage Class.
	*******************************************************************************************************************/
  class Passage {
    declare id: string;
    declare domId: string;
    declare title: string;
    // declare text: string;
    declare tags: string[];
    declare classes: string[];
    declare _excerpt: string | null;

    constructor({ title, text, tags }: SimplePassage) {
      const sortedAndUniqueTags = [...new Set<string>(tags)].sort((a, b) =>
        a.localeCompare(b)
      );

      const id = `passage-${Util.slugify(title)}`;
      this.#construct(id, Util.entityDecode(title), text, sortedAndUniqueTags);
    }

    // I extracted this private method to rename sortedAndUniqueTags -> tags and prevent the possibility of unsorted tag being used accidentally
    #construct(id: string, title: string, text: string, tags: string[]) {
      Object.defineProperties(this, {
        // Passage title.
        title: {
          value: title,
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
                    .map((tag) => Util.slugify(tag)))()
          ),
        },

        /* legacy */
        domId: {
          value: id,
        },
        /* /legacy */
      });
    }

    // Getters.
    get className() {
      return this.classes.join(' ');
    }

    // TODO: (v3) This should be → `get source`.
    get text() {
      return this.text;
    }

    description() {
      const descriptions = Config.passages.descriptions;

      switch (typeof descriptions) {
        case 'boolean':
          if (descriptions) {
            return this.title;
          }
          break;

        case 'object':
          if (descriptions.hasOwnProperty(this.title)) {
            return descriptions[this.title];
          }
          break;

        case 'function':
          {
            const result = descriptions.call(this);

            if (result) {
              return result;
            }
          }
          break;
      }

      // Initialize the excerpt cache from the raw passage text, if necessary.
      if (this._excerpt === null) {
        this._excerpt = Passage.getExcerptFromText(this.text);
      }

      return this._excerpt;
    }

    // TODO: (v3) This should be → `get text`.
    processText() {
        // Commented by BIS
    //   if (this.element == null) {
    //     // lazy equality for null
    //     return this.text;
    //   }

      // Handle image passage transclusion.
      if (this.tags.includes('Twine.image')) {
        return `[img[${this.text}]]`;
      }

      let processed = this.text;

      // Handle `Config.passages.onProcess`.
      if (Config.passages.onProcess) {
        processed = Config.passages.onProcess.call(null, {
          title: this.title,
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
      // Wikify the passage into a document fragment.
      const frag = document.createDocumentFragment();
      new Wikifier(frag, this.processText(), options);

      // Update the excerpt cache to reflect the rendered text.
      this._excerpt = Passage.getExcerptFromNode(frag);

      return frag;
    }

    static getExcerptFromNode(node: DocumentFragment, count?) {
      logger.debug(
        `[Passage.getExcerptFromNode(node=…, count=${count})]`,
        node
      );

      if (!node.hasChildNodes()) {
        return '';
      }

      // WARNING: es5-shim's `<String>.trim()` can cause "too much recursion" errors
      // here on very large strings (e.g., ≥40 KiB), at least in Firefox, for unknown
      // reasons.
      //
      // To fix the issue, we're removed `\u180E` from es5-shim's whitespace pattern
      // to prevent it from erroneously shimming `<String>.trim()` in the first place.
      let excerpt = node.textContent.trim();

      if (excerpt !== '') {
        const excerptRe = new RegExp(
          `(\\S+(?:\\s+\\S+){0,${count > 0 ? count - 1 : 7}})`
        );
        // @ts-ignore
        excerpt = excerpt
          // Compact whitespace.
          .replace(/\s+/g, ' ')
          // Attempt to match the excerpt regexp.
          .match(excerptRe);
      }

      return excerpt ? `${excerpt[1]}\u2026` : '\u2026'; // horizontal ellipsis
    }

    static getExcerptFromText(text: string, count?) {
      logger.debug(
        `[Passage.getExcerptFromText(text=…, count=${count})]`,
        text
      );

      if (text === '') {
        return '';
      }

      const excerptRe = new RegExp(
        `(\\S+(?:\\s+\\S+){0,${count > 0 ? count - 1 : 7}})`
      );
      const excerpt = text
        // Strip macro tags (replace with a space).
        .replace(/<<.*?>>/g, ' ')
        // Strip html tags (replace with a space).
        .replace(/<.*?>/g, ' ')
        // The above might have left problematic whitespace, so trim.
        .trim()
        // Strip table markup.
        .replace(/^\s*\|.*\|.*?$/gm, '')
        // Strip image markup.
        .replace(/\[[<>]?img\[[^\]]*\]\]/g, '')
        // Clean link markup (remove all but the link text).
        .replace(/\[\[([^|\]]*?)(?:(?:\||->|<-)[^\]]*)?\]\]/g, '$1')
        // Clean heading markup.
        .replace(/^\s*!+(.*?)$/gm, '$1')
        // Clean bold/italic/underline/highlight styles.
        .replace(/'{2}|\/{2}|_{2}|@{2}/g, '')
        // A final trim.
        .trim()
        // Compact whitespace.
        .replace(/\s+/g, ' ')
        // Attempt to match the excerpt regexp.
        .match(excerptRe);
      return excerpt ? `${excerpt[1]}\u2026` : '\u2026'; // horizontal ellipsis
    }
  }

  /*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
  return Passage;
})();

export type Passage = InstanceType<typeof PassageClass>;
