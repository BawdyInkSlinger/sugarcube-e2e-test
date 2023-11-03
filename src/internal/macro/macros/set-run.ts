/***********************************************************************************************************************

	macro/macros/set-run.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Macro, Scripting, getErrorMessage */
import { Config } from '../../config';
import { getErrorMessage } from '../../geterrormessage';
import { Has } from '../../has';
import { Scripting } from '../../scripting';
import { Macro } from '../macro';

export {} // imported for side effects only

/*
	<<set>>
*/
Macro.add('set', {
	skipArgs : true,

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no expression specified');
		}

		try {
			Scripting.evalJavaScript(this.args.full);
		}
		catch (ex: any) {
			return this.error(`bad evaluation: ${getErrorMessage(ex)}`);
		}

		// Custom debug view setup.
		if (Config.debug) {
			this.debugView.modes({ hidden : true });
		}
	}
});

/*
	<<run>> — Alias of <<set>>
*/
Macro.add('run', 'set');
