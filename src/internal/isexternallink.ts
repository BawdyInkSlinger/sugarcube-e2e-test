/***********************************************************************************************************************

	util/isexternallink.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns, Story */

import { Story } from './fakes/story';
import { Patterns } from './patterns';

/*
	Returns whether the given link source is external (probably).
*/
export const isExternalLink: (link: string) => boolean = (() => { // eslint-disable-line no-unused-vars, no-var
	const externalUrlRE = new RegExp(`^${Patterns.externalUrl}`, 'gim');
	const fingerprintRE = /[/\\?]/;

	function isExternalLink(link) {
		return !Story.has(link) && (externalUrlRE.test(link) || fingerprintRE.test(link));
	}

	return isExternalLink;
})();
