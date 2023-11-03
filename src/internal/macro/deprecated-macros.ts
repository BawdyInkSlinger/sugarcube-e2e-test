/* eslint-disable @typescript-eslint/no-this-alias */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
/***********************************************************************************************************************

	macro/deprecated-macros.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Has, Macro, Patterns, Scripting, SimpleAudio, State, Wikifier, getErrorMessage, storage */

/*******************************************************************************
	Variables Macros.
*******************************************************************************/
import jQuery from 'jquery';
import { getErrorMessage } from '../geterrormessage';
import { Config } from '../config';
import { Has } from '../has';
import { Patterns } from '../patterns';
import { Scripting } from '../scripting';
import { State } from '../state';
import { Wikifier } from '../wikifier';
import { Macro } from './macro';
import { StorageContainer } from '../fakes/storage';
/*
	[DEPRECATED] <<remember>>
*/
Macro.add('remember', {
  skipArgs: true,
  jsVarRe: new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

  handler() {
    if (this.args.full.length === 0) {
      return this.error('no expression specified');
    }

    try {
      Scripting.evalJavaScript(this.args.full);
    } catch (ex: any) {
      return this.error(`bad evaluation: ${getErrorMessage(ex)}`);
    }

    const remember = StorageContainer.storage.get('remember') || {};
    const jsVarRe = this.self.jsVarRe;
    let match;

    while ((match = jsVarRe.exec(this.args.full)) !== null) {
      const name = match[1];
      remember[name] = State.variables[name];
    }

    if (!StorageContainer.storage.set('remember', remember)) {
      return this.error(`unknown error, cannot remember: ${this.args.raw}`);
    }

    // Custom debug view setup.
    if (Config.debug) {
      this.debugView.modes({ hidden: true });
    }
  },

  init() {
    const remember = StorageContainer.storage.get('remember');

    if (remember) {
      Object.keys(remember).forEach(
        (name) => (State.variables[name] = remember[name])
      );
    }
  },
});

/*
	[DEPRECATED] <<forget>>
*/
Macro.add('forget', {
  skipArgs: true,
  jsVarRe: new RegExp(`State\\.variables\\.(${Patterns.identifier})`, 'g'),

  handler() {
    if (this.args.full.length === 0) {
      return this.error('no story variable list specified');
    }

    const remember = StorageContainer.storage.get('remember');
    const jsVarRe = this.self.jsVarRe;
    let match;
    let needStore = false;

    while ((match = jsVarRe.exec(this.args.full)) !== null) {
      const name = match[1];

      if (Object.hasOwn(State.variables, name)) {
        delete State.variables[name];
      }

      if (remember && Object.hasOwn(remember, name)) {
        needStore = true;
        delete remember[name];
      }
    }

    if (needStore) {
      if (Object.keys(remember).length === 0) {
        if (!StorageContainer.storage.delete('remember')) {
          return this.error('unknown error, cannot update remember store');
        }
      } else if (!StorageContainer.storage.set('remember', remember)) {
        return this.error('unknown error, cannot update remember store');
      }
    }

    // Custom debug view setup.
    if (Config.debug) {
      this.debugView.modes({ hidden: true });
    }
  },
});

/*******************************************************************************
	Display Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<silently>> — Alias of <<silent>>
*/
Macro.add('silently', 'silent');

/*
	[DEPRECATED] <<display>> — Alias of <<include>>
*/
Macro.add('display', 'include');

/*******************************************************************************
	Interactive Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<click>> — Alias of <<link>>
*/
Macro.add('click', 'link');

/*******************************************************************************
	Links Macros.
*******************************************************************************/

/*
	[DEPRECATED] <<actions>>
*/
Macro.add('actions', {
  handler() {
    const $list = jQuery(document.createElement('ul'))
      .addClass(this.name)
      .appendTo(this.output);

    for (let i = 0; i < this.args.length; ++i) {
      let passage;
      let text;
      let $image;
      let setFn;

      if (typeof this.args[i] === 'object') {
        if (this.args[i].isImage) {
          // Argument was in wiki image syntax.
          $image = jQuery(document.createElement('img')).attr(
            'src',
            this.args[i].source
          );

          if (Object.hasOwn(this.args[i], 'passage')) {
            $image.attr('data-passage', this.args[i].passage);
          }

          if (Object.hasOwn(this.args[i], 'title')) {
            $image.attr('title', this.args[i].title);
          }

          if (Object.hasOwn(this.args[i], 'align')) {
            $image.attr('align', this.args[i].align);
          }

          passage = this.args[i].link;
          setFn = this.args[i].setFn;
        } else {
          // Argument was in wiki link syntax.
          text = this.args[i].text;
          passage = this.args[i].link;
          setFn = this.args[i].setFn;
        }
      } else {
        // Argument was simply the passage name.
        text = passage = this.args[i];
      }

      if (
        Object.hasOwn(State.variables as object, '#actions') &&
        Object.hasOwn(State.variables['#actions'], passage) &&
        State.variables['#actions'][passage]
      ) {
        continue;
      }

      const $link = jQuery(
        Wikifier.createInternalLink(
          jQuery(document.createElement('li')).appendTo($list),
          passage,
          null,
          ((passage, fn) => () => {
            if (!Object.hasOwn(State.variables as object, '#actions')) {
              State.variables['#actions'] = {};
            }

            State.variables['#actions'][passage] = true;

            if (typeof fn === 'function') {
              fn();
            }
          })(passage, setFn)
        )
      )
        .addClass(`macro-${this.name}`)
        .append($image || document.createTextNode(text));

      if ($image) {
        $link.addClass('link-image');
      }
    }
  },
});

/*
	[DEPRECATED] <<choice>>
*/
Macro.add('choice', {
  handler() {
    if (this.args.length === 0) {
      return this.error('no passage specified');
    }

    const choiceId = State.passage;
    let passage;
    let text;
    let $image;
    let setFn;

    if (this.args.length === 1) {
      if (typeof this.args[0] === 'object') {
        if (this.args[0].isImage) {
          // Argument was in wiki image syntax.
          $image = jQuery(document.createElement('img')).attr(
            'src',
            this.args[0].source
          );

          if (Object.hasOwn(this.args[0], 'passage')) {
            $image.attr('data-passage', this.args[0].passage);
          }

          if (Object.hasOwn(this.args[0], 'title')) {
            $image.attr('title', this.args[0].title);
          }

          if (Object.hasOwn(this.args[0], 'align')) {
            $image.attr('align', this.args[0].align);
          }

          passage = this.args[0].link;
          setFn = this.args[0].setFn;
        } else {
          // Argument was in wiki link syntax.
          text = this.args[0].text;
          passage = this.args[0].link;
          setFn = this.args[0].setFn;
        }
      } else {
        // Argument was simply the passage name.
        text = passage = this.args[0];
      }
    } else {
      // NOTE: The arguments here are backwards.
      passage = this.args[0];
      text = this.args[1];
    }

    let $link;

    if (
      Object.hasOwn(State.variables as object, '#choice') &&
      Object.hasOwn(State.variables['#choice'], choiceId) &&
      State.variables['#choice'][choiceId]
    ) {
      $link = jQuery(document.createElement('span'))
        .addClass(`link-disabled macro-${this.name}`)
        .attr('tabindex', -1)
        .append($image || document.createTextNode(text))
        .appendTo(this.output);

      if ($image) {
        $link.addClass('link-image');
      }

      return;
    }

    $link = jQuery(
      Wikifier.createInternalLink(this.output, passage, null, () => {
        if (!Object.hasOwn(State.variables as object, '#choice')) {
          State.variables['#choice'] = {};
        }

        State.variables['#choice'][choiceId] = true;

        if (typeof setFn === 'function') {
          setFn();
        }
      })
    )
      .addClass(`macro-${this.name}`)
      .append($image || document.createTextNode(text));

    if ($image) {
      $link.addClass('link-image');
    }
  },
});

/*******************************************************************************
	Audio Macros.
*******************************************************************************/

(() => {
  if (Has.audio) {
    /*
			[DEPRECATED] <<setplaylist track_id_list>>
		*/
    Macro.add('setplaylist', {
      handler() {
        if (this.args.length === 0) {
          return this.error('no track ID(s) specified');
        }

        const playlist = Macro.get('playlist');

        if (playlist.from !== null && playlist.from !== 'setplaylist') {
          return this.error(
            'playlists have already been defined with <<createplaylist>>'
          );
        }

        // Create the new playlist.
        console.log(`FAKED: SimpleAudio.lists.add('setplaylist', this.args.slice(0));`);
        
        // BIS comment
        // try {
        //   SimpleAudio.lists.add('setplaylist', this.args.slice(0));
        // } catch (ex: any) {
        //   return this.error(ex.message);
        // }

        // Lock `<<playlist>>` into our syntax.
        if (playlist.from === null) {
          playlist.from = 'setplaylist';
        }

        // Custom debug view setup.
        if (Config.debug) {
          this.debugView.modes({ hidden: true });
        }
      },
    });

    /*
			[DEPRECATED] <<stopallaudio>>
		*/
    Macro.add('stopallaudio', {
      skipArgs: true,

      handler() {
        // BIS comment
        // SimpleAudio.select(':all').stop();
        console.log(`FAKED: SimpleAudio.select(':all').stop();`);

        // Custom debug view setup.
        if (Config.debug) {
          this.debugView.modes({ hidden: true });
        }
      },
    });
  } else {
    // The HTML5 <audio> API is unavailable, so add no-op versions.
    Macro.add(['setplaylist', 'stopallaudio'], {
      skipArgs: true,

      handler() {
        /* no-op */

        // Custom debug view setup.
        if (Config.debug) {
          this.debugView.modes({ hidden: true });
        }
      },
    });
  }
})();
