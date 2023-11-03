/***********************************************************************************************************************

	macro/macros/button-link.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Engine, Macro, State, Story, Wikifier */
import jQuery from 'jquery';
import { Has } from '../../has';
import { Story } from '../../fakes/story';
import { Macro } from '../macro';
import { Config } from '../../config';
import { Engine } from '../../fakes/engine';
import { State } from '../../state';
import { Wikifier } from '../../wikifier';

export {} // imported for side effects only

/*
	<<button>> & <<link>>
*/
Macro.add(['button', 'link'], {
	isAsync : true,
	tags    : null,

	handler() {
		if (this.args.length === 0) {
			return this.error(`no ${this.name === 'button' ? 'button' : 'link'} text specified`);
		}

		const $link = jQuery(document.createElement(this.name === 'button' ? 'button' : 'a'));
		let passage;

		if (typeof this.args[0] === 'object') {
			// Argument was in wiki image syntax.
			if (this.args[0].isImage) {
				const $image = jQuery(document.createElement('img'))
					.attr('src', this.args[0].source)
					.appendTo($link);

				$link.addClass('link-image');

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
			}
			// Argument was in wiki link syntax.
			else {
				$link.append(document.createTextNode(this.args[0].text));
				passage = this.args[0].link;
			}
		}
		// Argument was simply the link text.
		else {
			$link.wikiWithOptions({ cleanup : false, profile : 'core' }, this.args[0]);
			passage = this.args.length > 1 ? this.args[1] : undefined;
		}

		if (passage != null) { // lazy equality for null
			$link.attr('data-passage', passage);

			if (Story.has(passage)) {
				$link.addClass('link-internal');

				if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
					$link.addClass('link-visited');
				}
			}
			else {
				$link.addClass('link-broken');
			}
		}
		else {
			$link.addClass('link-internal');
		}

		$link
			.addClass(`macro-${this.name}`)
			.ariaClick({
				namespace : '.macros',
				role      : passage != null ? 'link' : 'button', // lazy equality for null
				one       : passage != null // lazy equality for null
			}, this.shadowHandler(
				this.payload[0].contents !== ''
					? () => Wikifier.wikifyEval(this.payload[0].contents.trim())
					: null,
				passage != null // lazy equality for null
					? () => Engine.play(passage)
					: null
			))
			.appendTo(this.output);
	}
});
