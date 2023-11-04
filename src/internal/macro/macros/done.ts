/***********************************************************************************************************************

	macro/macros/done.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Engine, Macro */
import { Engine } from '../../fakes/engine';
import { Has } from '../../has';
import { triggerTimeout } from '../../../trigger-timeout';
import { Macro } from '../macro';

export {} // imported for side effects only

/*
	<<done>>
*/
Macro.add('done', {
	skipArgs : true,
	tags     : null,

	handler() {
		const contents = this.payload[0].contents.trim();

		// Do nothing if there's no content to process.
		if (contents === '') {
			return;
		}

		triggerTimeout(`<<done>> macro: ${contents}`, this.shadowHandler(() => $.wiki(contents)), Engine.DOM_DELAY);
	}
});
