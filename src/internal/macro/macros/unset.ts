/***********************************************************************************************************************

	macro/macros/unset.js

	Copyright © 2013–2023 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
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
	<<unset>>
*/
Macro.add('unset', {
	skipArgs : true,

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no story/temporary variable list specified');
		}

		const searchRe  = /[,;\s]*((?:State\.(?:variables|temporary)|setup)\.)/g;
		const replacer  = (_, p1) => `; delete ${p1}`;
		const cleanupRe = /^; /;

		try {
			const unsetExp = this.args.full.replace(searchRe, replacer).replace(cleanupRe, '');

			Scripting.evalJavaScript(unsetExp);
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
