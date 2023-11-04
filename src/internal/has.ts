/***********************************************************************************************************************

	lib/has.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Browser */

const Has = (() => { // eslint-disable-line no-unused-vars, no-var
	/*
		NOTE: The aggressive try/catch feature tests are necessitated by
		implementation bugs in various browsers.
	*/

	// Is the `HTMLAudioElement` API available?
	const hasAudioElement = (() => {
		try {
			return typeof document.createElement('audio').canPlayType === 'function';
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the `File` API available?
	const hasFile = (() => {
		try {
			return 'Blob' in window
				&& 'File' in window
				&& 'FileList' in window
				&& 'FileReader' in window
        // BIS NOTE: I've commented out the next line
				// && (!Browser.isOpera || Browser.operaVersion >= 15);
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the `geolocation` API available?
	const hasGeolocation = (() => {
		try {
			return 'geolocation' in navigator
				&& typeof navigator.geolocation.getCurrentPosition === 'function'
				&& typeof navigator.geolocation.watchPosition === 'function';
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the `MutationObserver` API available?
	const hasMutationObserver = (() => {
		try {
			return 'MutationObserver' in window
				&& typeof window.MutationObserver === 'function';
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the `performance` API available?
	const hasPerformance = (() => {
		try {
			return 'performance' in window
				&& typeof window.performance.now === 'function';
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the platform a touch device?
	const hasTouch = (() => {
		try {
			return 'ontouchstart' in window
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      || !!window.DocumentTouch && document instanceof window.DocumentTouch
      || !!navigator.maxTouchPoints
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
				|| !!navigator.msMaxTouchPoints;
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();

	// Is the transition end event available and by what name?
	const hasTransitionEndEvent = (() => {
		try {
			const teMap = new Map([
				['transition',       'transitionend'],
				['MSTransition',     'msTransitionEnd'],
				['WebkitTransition', 'webkitTransitionEnd'],
				['MozTransition',    'transitionend']
			]);
			const teKeys = Array.from(teMap.keys());
			const el     = document.createElement('div');

			for (let i = 0; i < teKeys.length; ++i) {
				if (el.style[teKeys[i]] !== undefined) {
					return teMap.get(teKeys[i]);
				}
			}
		}
		catch (ex: any) { /* no-op */ }

		return false;
	})();


	/*******************************************************************************
		Object Exports.
	*******************************************************************************/

	return Object.freeze(Object.assign(Object.create(null), {
		audio              : hasAudioElement,
		fileAPI            : hasFile,
		geolocation        : hasGeolocation,
		mutationObserver   : hasMutationObserver,
		performance        : hasPerformance,
		touch              : hasTouch,
		transitionEndEvent : hasTransitionEndEvent
	}));
})();

export { Has }