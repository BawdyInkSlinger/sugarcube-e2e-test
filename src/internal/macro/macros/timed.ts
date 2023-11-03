/***********************************************************************************************************************

	macro/macros/timed.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, DebugView, Engine, Macro, State, Wikifier, cssTimeToMS */
import jQuery from 'jquery';
import { DebugView } from '../../debugview';
import { Config } from '../../config';
import { Engine } from '../../fakes/engine';
import { State } from '../../state';
import { Has } from '../../has';
import { Wikifier } from '../../wikifier';
import { Macro } from '../macro';
import { cssTimeToMS } from '../../csstimetoms';
import { MacroContext } from '../macrocontext';
import { TimeoutData, triggerTimeout } from '../../util/trigger-timeout';

export {} // imported for side effects only

type Item = {
  name    : string,
  source  : unknown,
  delay   : number,
  content : string,
}

/*
	<<timed>> & <<next>>
*/
Macro.add('timed', {
	isAsync : true,
	tags    : ['next'],
	timers  : new Set<NodeJS.Timeout>(),
	t8nRe   : /^(?:transition|t8n)$/,

	handler(this: InstanceType<typeof MacroContext>): false | void {
		if (this.args.length === 0) {
			return this.error('no time value specified in <<timed>>');
		}

  const items: Item[] = [];

		try {
			items.push({
				name    : this.name,
				source  : this.source,
				delay   : Math.max(Engine.DOM_DELAY, cssTimeToMS(this.args[0])),
				content : this.payload[0].contents
			});
		}
		catch (ex: any) {
			return this.error(`${ex.message} in <<timed>>`);
		}

		if (this.payload.length > 1) {
			let i;

			try {
				let len;

				for (i = 1, len = this.payload.length; i < len; ++i) {
					items.push({
						name   : this.payload[i].name,
						source : this.payload[i].source,
						delay  : this.payload[i].args.length === 0
							? items[items.length - 1].delay
							: Math.max(Engine.DOM_DELAY, cssTimeToMS(this.payload[i].args[0])),
						content : this.payload[i].contents
					});
				}
			}
			catch (ex: any) {
				return this.error(`${ex.message} in <<next>> (#${i})`);
			}
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ block : true });
		}

		const transition = this.args.length > 1 && this.self.t8nRe.test(this.args[1]);
		const $wrapper   = jQuery(document.createElement('span'))
			.addClass(`macro-${this.name}`)
			.appendTo(this.output);

		// Register the timer.
		this.self.registerTimeout(this.shadowHandler<Item>(item => {
			const frag = document.createDocumentFragment();
			new Wikifier(frag, item.content, { cleanup : false });

			// Output.
			let $output = $wrapper;

			// Custom debug view setup for `<<next>>`.
			if (Config.debug && item.name === 'next') {
				$output = jQuery(new DebugView( // eslint-disable-line no-param-reassign
					$output[0],
					'macro',
					item.name,
					item.source
				).output);
			}

			if (transition) {
				$output = jQuery(document.createElement('span'))
					.addClass('macro-timed-insert macro-timed-in')
					.appendTo($output);
			}

			$output.append(frag);

			if (transition) {
				triggerTimeout("<<timed>> macro: transition", () => $output.removeClass('macro-timed-in'), Engine.DOM_DELAY);
			}
		}), items);
	},

	registerTimeout(callback, items: Item[]) {
		if (typeof callback !== 'function') {
			throw new TypeError('callback parameter must be a function');
		}

		// Cache info about the current turn.
		const passage = State.passage;
		const turn    = State.turns;

		// Timer info.
		const timers: Set<TimeoutData> = this.timers;
		let timeoutData: TimeoutData  = null;
		let nextItem = items.shift();

		const worker = function () {
			// Bookkeeping.
			timers.delete(timeoutData);

			// Terminate if we've navigated away.
			if (State.passage !== passage || State.turns !== turn) {
				return;
			}

			// Set the current item and set up the next worker, if any.
			const curItem = nextItem;

			if ((nextItem = items.shift()) != null) { // lazy equality for null
				timeoutData = triggerTimeout(`<<timed>> macro: ${nextItem.content}`, worker, nextItem.delay);
				timers.add(timeoutData);
			}

			// Execute the callback.
			callback.call(this, curItem);
		};

		// Set up the timeout and record its ID.
		timeoutData = triggerTimeout(`<<timed>> macro: ${nextItem.content}`, worker, nextItem.delay);
		timers.add(timeoutData);

		// Set up a single-use event handler to remove pending timers upon passage navigation.
		if (timers.size === 1) {
			jQuery(document).one(':passageinit', () => {
				timers.forEach((timerData) => timerData.cancelTimeout());
				timers.clear();
			});
		}
	}
});
