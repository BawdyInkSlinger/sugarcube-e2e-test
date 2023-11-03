/***********************************************************************************************************************

	macro/macros/print.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Macro, Scripting, Wikifier, encodeEntities, getErrorMessage, stringFrom */
import { getErrorMessage } from '../../geterrormessage';
import { Macro } from '../macro';
import { Has } from '../../has';
import { Scripting } from '../../scripting';
import { stringFrom } from '../../stringfrom';
import { Wikifier } from '../../wikifier';
import { encodeEntities } from '../../encodeentities';

export {} // imported for side effects only

/*
	<<print>>, <<=>>, & <<->>
*/
Macro.add(['print', '=', '-'], {
	skipArgs : true,

	handler() {
		if (this.args.full.length === 0) {
			return this.error('no expression specified');
		}

		try {
			const result = stringFrom(Scripting.evalJavaScript(this.args.full));

			if (result !== null) {
				new Wikifier(this.output, this.name === '-' ? encodeEntities(result) : result);
			}
		}
		catch (ex: any) {
			return this.error(`bad evaluation: ${getErrorMessage(ex)}`);
		}
	}
});
