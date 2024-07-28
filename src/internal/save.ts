import {
  SaveAPI,
  SaveDetails,
  SaveObject,
} from './declarations/twine-sugarcube-copy/save';
import { getLogger } from '../logging/logger';
import { Config } from './config';
import { Dialog } from './dialog';
import { Engine } from './fakes/engine';
import { Story } from './fakes/story';
import { L10n } from './l10n';
import { State } from './state';
import { UI } from './ui';
import { Util } from './util';
import { objectDefineProperties } from './utils/object-define-properties';
import { StorageContainer } from './fakes/storage';
import { LZString } from './lz-string.min';

const logger = getLogger();

/***********************************************************************************************************************

	save.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Config, Dialog, Engine, L10n, State, Story, UI, Util, storage */

export const Save = (() => { // eslint-disable-line no-unused-vars, no-var
	'use strict';

	// Save operation type pseudo-enumeration.
	const Type = Util.toEnum({
		Autosave  : 'autosave',
		Disk      : 'disk',
		Serialize : 'serialize',
		Slot      : 'slot'
	});

	// The upper bound of the saves slots.
	let _slotsUBound = -1;

	// Set of onLoad handlers.
	const _onLoadHandlers = new Set();

	// Set of onSave handlers.
	const _onSaveHandlers = new Set();


	/*******************************************************************************************************************
		Saves Functions.
	*******************************************************************************************************************/
	function savesInit() {
		logger.debug('[Save/savesInit()]'); 

		// Disable save slots and the autosave when Web Storage is unavailable.
		if (StorageContainer.storage.name === 'cookie') {
			savesObjClear();
            // @ts-ignore
			Config.saves.autoload = undefined;
            // @ts-ignore
			Config.saves.autosave = undefined;
            // @ts-ignore
			Config.saves.slots = 0;
			return false;
		}

		let saves   = savesObjGet();
		let updated = false;

		/* legacy */
		// Convert an ancient saves array into a new saves object.
		if (Array.isArray(saves)) {
			saves = {
                autosave: null,
                slots: saves
            } as unknown as SaveAPI;
			updated = true;
		}
		/* /legacy */

		// Handle the author changing the number of save slots.
		if (Config.saves.slots !== saves.slots.length) {
			if (Config.saves.slots < saves.slots.length) {
				// Attempt to decrease the number of slots; this will only compact
				// the slots array, by removing empty slots, no saves will be deleted.
                // @ts-ignore
				saves.slots.reverse();

                // @ts-ignore
				saves.slots = saves.slots.filter(function (val) {
					if (val === null && this.count > 0) {
						--this.count;
						return false;
					}

					return true;
				}, { count : saves.slots.length - Config.saves.slots });

                // @ts-ignore
				saves.slots.reverse();
			}
			else if (Config.saves.slots > saves.slots.length) {
				// Attempt to increase the number of slots.
				_appendSlots(saves.slots, Config.saves.slots - saves.slots.length);
			}

			updated = true;
		}

		/* legacy */
		// Update saves with old/obsolete properties.
		if (_savesObjUpdate(saves.autosave)) {
			updated = true;
		}

		for (let i = 0; i < saves.slots.length; ++i) {
			if (_savesObjUpdate(saves.slots[i])) {
				updated = true;
			}
		}

		// Remove save stores which are empty.
		if (_savesObjIsEmpty(saves)) {
			StorageContainer.storage.delete('saves');
			updated = false;
		}
		/* /legacy */

		// If the saves object was updated, then update the store.
		if (updated) {
			_savesObjSave(saves);
		}

		_slotsUBound = saves.slots.length - 1;

		return true;
	}

	function savesObjCreate(): SaveAPI {
		return {
			autosave : null,
			slots    : _appendSlots([], Config.saves.slots)
		} as SaveAPI;
	}

	function savesObjGet(): SaveAPI {
		const saves = StorageContainer.storage.get('saves');
		return saves === null ? savesObjCreate() : saves;
	}

	function savesObjClear() {
		StorageContainer.storage.delete('saves');
		return true;
	}

	function savesOk() {
		return autosaveOk() || slotsOk();
	}


	/*******************************************************************************************************************
		Autosave Functions.
	*******************************************************************************************************************/
	function autosaveOk() {
		return StorageContainer.storage.name !== 'cookie' && typeof Config.saves.autosave !== 'undefined';
	}

	function autosaveHas() {
		const saves = savesObjGet();

		if (saves.autosave === null) {
			return false;
		}

		return true;
	}

	function autosaveGet() {
		const saves = savesObjGet();
		return saves.autosave;
	}

	function autosaveLoad() {
		const saves = savesObjGet();

		if (saves.autosave === null) {
			return false;
		}

		return _unmarshal(saves.autosave);
	}

	function autosaveSave(title?, metadata?) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			return false;
		}

		const saves        = savesObjGet();
		const supplemental: any = {
			title : title || Story.get(State.passage).description(),
			date  : Date.now()
		};

		if (metadata != null) { // lazy equality for null
			supplemental.metadata = metadata;
		}

		saves.autosave = _marshal(supplemental, { type : Type.Autosave });

		return _savesObjSave(saves);
	}

	function autosaveDelete() {
		const saves = savesObjGet();
		saves.autosave = null;
		return _savesObjSave(saves);
	}


	/*******************************************************************************************************************
		Slots Functions.
	*******************************************************************************************************************/
	function slotsOk() {
		return StorageContainer.storage.name !== 'cookie' && _slotsUBound !== -1;
	}

	function slotsLength() {
		return _slotsUBound + 1;
	}

	function slotsCount() {
		if (!slotsOk()) {
			return 0;
		}

		const saves = savesObjGet();
		let count = 0;

		for (let i = 0, iend = saves.slots.length; i < iend; ++i) {
			if (saves.slots[i] !== null) {
				++count;
			}
		}
		return count;
	}

	function slotsIsEmpty() {
		return slotsCount() === 0;
	}

	function slotsHas(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length || saves.slots[slot] === null) {
			return false;
		}

		return true;
	}

	function slotsGet(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return null;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return null;
		}

		return saves.slots[slot];
	}

	function slotsLoad(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length || saves.slots[slot] === null) {
			return false;
		}

		return _unmarshal(saves.slots[slot]);
	}

	function slotsSave(slot, title, metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return false;
		}

		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return false;
		}

		const supplemental: any = {
			title : title || Story.get(State.passage).description(),
			date  : Date.now()
		};

		if (metadata != null) { // lazy equality for null
			supplemental.metadata = metadata;
		}

		saves.slots[slot] = _marshal(supplemental, { type : Type.Slot });

		return _savesObjSave(saves);
	}

	function slotsDelete(slot) {
		if (slot < 0 || slot > _slotsUBound) {
			return false;
		}

		const saves = savesObjGet();

		if (slot >= saves.slots.length) {
			return false;
		}

		saves.slots[slot] = null;
		return _savesObjSave(saves);
	}


	/*******************************************************************************************************************
		Disk Import/Export Functions.
	*******************************************************************************************************************/
	function exportToDisk(filename?: string, metadata?) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return;
		}

		function getDatestamp() {
			const now = new Date();
			let MM: number | string = now.getMonth() + 1;
			let DD: number | string = now.getDate();
			let hh: number | string = now.getHours();
			let mm: number | string = now.getMinutes();
			let ss: number | string = now.getSeconds();

			if (MM < 10) { MM = `0${MM}`; }
			if (DD < 10) { DD = `0${DD}`; }
			if (hh < 10) { hh = `0${hh}`; }
			if (mm < 10) { mm = `0${mm}`; }
			if (ss < 10) { ss = `0${ss}`; }

			return `${now.getFullYear()}${MM}${DD}-${hh}${mm}${ss}`;
		}

		function getFilename(str) {
			return Util.sanitizeFilename(str)
				.replace(/[_\s\u2013\u2014-]+/g, '-'); // legacy
		}

		const baseName     = filename == null ? Story.domId : getFilename(filename); // lazy equality for null
		const saveName     = `${baseName}-${getDatestamp()}.save`;
		const supplemental = metadata == null ? {} : { metadata }; // lazy equality for null
		const saveObj      = LZString.compressToBase64(JSON.stringify(_marshal(supplemental, { type : Type.Disk })));
		saveAs(new Blob([saveObj], { type : 'text/plain;charset=UTF-8' }), saveName);
	}

	function importFromDisk(event) {
		const file   = event.target.files[0];
		const reader = new FileReader();

		// Add the handler that will capture the file information once the load is finished.
		jQuery(reader).one('loadend', () => {
			if (reader.error) {
				const ex = reader.error;
				UI.alert(`${L10n.get('errorSaveDiskLoadFailed').toUpperFirst()} (${ex.name}: ${ex.message}).</p><p>${L10n.get('aborting')}.`);
				return;
			}

			let saveObj;

			try {
				saveObj = JSON.parse(
                    // @ts-ignore
					/* legacy */ /\.json$/i.test(file.name) || /^\{/.test(reader.result)
						? reader.result
						: /* /legacy */ LZString.decompressFromBase64(reader.result)
				);
			}
			catch (ex) { /* no-op; `_unmarshal()` will handle the error */ }

			_unmarshal(saveObj);
		});

		// Initiate the file load.
		reader.readAsText(file);
	}


	/*******************************************************************************************************************
		Serialization Functions.
	*******************************************************************************************************************/
	function serialize(metadata) {
		if (typeof Config.saves.isAllowed === 'function' && !Config.saves.isAllowed()) {
			if (Dialog.isOpen()) {
				$(document).one(':dialogclosed', () => UI.alert(L10n.get('savesDisallowed')));
			}
			else {
				UI.alert(L10n.get('savesDisallowed'));
			}

			return null;
		}

		const supplemental = metadata == null ? {} : { metadata }; // lazy equality for null
		return LZString.compressToBase64(JSON.stringify(_marshal(supplemental, { type : Type.Serialize })));
	}

	function deserialize(base64Str) {
		/*
			NOTE: We purposefully do not attempt to catch parameter shenanigans
			here, instead relying on `_unmarshal()` to do the heavy lifting.
		*/

		let saveObj;

		try {
			saveObj = JSON.parse(LZString.decompressFromBase64(base64Str));
		}
		catch (ex) { /* no-op; `_unmarshal()` will handle the error */ }

		if (!_unmarshal(saveObj)) {
			return null;
		}

		return saveObj.metadata;
	}


	/*******************************************************************************************************************
		Event Functions.
	*******************************************************************************************************************/
	function onLoadAdd(handler) {
		const valueType = Util.getType(handler);

		if (valueType !== 'function') {
			throw new TypeError(`Save.onLoad.add handler parameter must be a function (received: ${valueType})`);
		}

		_onLoadHandlers.add(handler);
	}

	function onLoadClear() {
		_onLoadHandlers.clear();
	}

	function onLoadDelete(handler) {
		return _onLoadHandlers.delete(handler);
	}

	function onLoadSize() {
		return _onLoadHandlers.size;
	}

	function onSaveAdd(handler) {
		const valueType = Util.getType(handler);

		if (valueType !== 'function') {
			throw new TypeError(`Save.onSave.add handler parameter must be a function (received: ${valueType})`);
		}

		_onSaveHandlers.add(handler);
	}

	function onSaveClear() {
		_onSaveHandlers.clear();
	}

	function onSaveDelete(handler) {
		return _onSaveHandlers.delete(handler);
	}

	function onSaveSize() {
		return _onSaveHandlers.size;
	}


	/*******************************************************************************************************************
		Utility Functions.
	*******************************************************************************************************************/
	function _appendSlots(array, num) {
		for (let i = 0; i < num; ++i) {
			array.push(null);
		}

		return array;
	}

	function _savesObjIsEmpty(saves) {
		const slots = saves.slots;
		let isSlotsEmpty = true;

		for (let i = 0, iend = slots.length; i < iend; ++i) {
			if (slots[i] !== null) {
				isSlotsEmpty = false;
				break;
			}
		}

		return saves.autosave === null && isSlotsEmpty;
	}

	function _savesObjSave(saves: SaveAPI): boolean {
		if (_savesObjIsEmpty(saves)) {
			StorageContainer.storage.delete('saves');
			return true;
		}

		return StorageContainer.storage.set('saves', saves);
	}

	function _savesObjUpdate(saveObj) {
		if (saveObj == null || typeof saveObj !== 'object') { // lazy equality for null
			return false;
		}

		let updated = false;

		/* eslint-disable no-param-reassign */
		if (
			   !saveObj.hasOwnProperty('state')
			|| !saveObj.state.hasOwnProperty('delta')
			|| !saveObj.state.hasOwnProperty('index')
		) {
			if (saveObj.hasOwnProperty('data')) {
				delete saveObj.mode;
				saveObj.state = {
					delta : State.deltaEncode(saveObj.data)
				};
				delete saveObj.data;
			}
			else if (!saveObj.state.hasOwnProperty('delta')) {
				delete saveObj.state.mode;
				saveObj.state.delta = State.deltaEncode(saveObj.state.history);
				delete saveObj.state.history;
			}
			else if (!saveObj.state.hasOwnProperty('index')) {
				delete saveObj.state.mode;
			}

			saveObj.state.index = saveObj.state.delta.length - 1;
			updated = true;
		}

		if (saveObj.state.hasOwnProperty('rseed')) {
			saveObj.state.seed = saveObj.state.rseed;
			delete saveObj.state.rseed;

			saveObj.state.delta.forEach((_, i, delta) => {
				if (delta[i].hasOwnProperty('rcount')) {
					delta[i].pull = delta[i].rcount;
					delete delta[i].rcount;
				}
			});

			updated = true;
		}

		if (
			   saveObj.state.hasOwnProperty('expired') && typeof saveObj.state.expired === 'number'
			||  saveObj.state.hasOwnProperty('unique')
			||  saveObj.state.hasOwnProperty('last')
		) {
			if (saveObj.state.hasOwnProperty('expired') && typeof saveObj.state.expired === 'number') {
				delete saveObj.state.expired;
			}

			if (saveObj.state.hasOwnProperty('unique') || saveObj.state.hasOwnProperty('last')) {
				saveObj.state.expired = [];

				if (saveObj.state.hasOwnProperty('unique')) {
					saveObj.state.expired.push(saveObj.state.unique);
					delete saveObj.state.unique;
				}

				if (saveObj.state.hasOwnProperty('last')) {
					saveObj.state.expired.push(saveObj.state.last);
					delete saveObj.state.last;
				}
			}

			updated = true;
		}
		/* eslint-enable no-param-reassign */

		return updated;
	}

	function _marshal(supplemental, details) {
		logger.debug(`[Save/_marshal(…, { type : '${details.type}' })]`); 

		if (supplemental != null && typeof supplemental !== 'object') { // lazy equality for null
			throw new Error('supplemental parameter must be an object');
		}

		const saveObj = Object.assign({}, supplemental, {
			id    : Config.saves.id,
			state : State.marshalForSave()
		});

		if (Config.saves.version) {
			saveObj.version = Config.saves.version;
		}

		_onSaveHandlers.forEach((fn: any) => fn(saveObj, details));

		// Delta encode the state history and delete the non-encoded property.
		saveObj.state.delta = State.deltaEncode(saveObj.state.history);
		delete saveObj.state.history;

		return saveObj;
	}

	function _unmarshal(saveObj) {
		logger.debug('[Save/_unmarshal()]'); 

		try {
			/* eslint-disable no-param-reassign */
			/* legacy */
			// Update saves with old/obsolete properties.
			_savesObjUpdate(saveObj);
			/* /legacy */

			if (!saveObj || !saveObj.hasOwnProperty('id') || !saveObj.hasOwnProperty('state')) {
				throw new Error(L10n.get('errorSaveMissingData'));
			}

			// Delta decode the state history and delete the encoded property.
			saveObj.state.history = State.deltaDecode(saveObj.state.delta);
			delete saveObj.state.delta;

			_onLoadHandlers.forEach((fn: any) => fn(saveObj));

			if (saveObj.id !== Config.saves.id) {
				throw new Error(L10n.get('errorSaveIdMismatch'));
			}

			// Restore the state.
			State.unmarshalForSave(saveObj.state); // may also throw exceptions

			// Show the active moment.
			Engine.show();
			/* eslint-enable no-param-reassign */
		}
		catch (ex) {
			UI.alert(`${(ex as Error).message.toUpperFirst()}.</p><p>${L10n.get('aborting')}.`);
			return false;
		}

		return true;
	}


	/*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
	return Object.freeze(objectDefineProperties({}, {
		/*
			Save Functions.
		*/
		init  : { value : savesInit },
		get   : { value : savesObjGet },
		clear : { value : savesObjClear },
		ok    : { value : savesOk },

		/*
			Autosave Functions.
		*/
		autosave : {
			value : Object.freeze(objectDefineProperties({}, {
				ok     : { value : autosaveOk },
				has    : { value : autosaveHas },
				get    : { value : autosaveGet },
				load   : { value : autosaveLoad },
				save   : { value : autosaveSave },
				delete : { value : autosaveDelete }
			}))
		},

		/*
			Slots Functions.
		*/
		slots : {
			value : Object.freeze(objectDefineProperties({}, {
				ok      : { value : slotsOk },
				length  : { get : slotsLength },
				isEmpty : { value : slotsIsEmpty },
				count   : { value : slotsCount },
				has     : { value : slotsHas },
				get     : { value : slotsGet },
				load    : { value : slotsLoad },
				save    : { value : slotsSave },
				delete  : { value : slotsDelete }
			}))
		},

		/*
			Disk Import/Export Functions.
		*/
		export : { value : exportToDisk },
		import : { value : importFromDisk },

		/*
			Serialization Functions.
		*/
		serialize   : { value : serialize },
		deserialize : { value : deserialize },

		/*
			Event Functions.
		*/
		onLoad : {
			value : Object.freeze(objectDefineProperties({}, {
				add    : { value : onLoadAdd },
				clear  : { value : onLoadClear },
				delete : { value : onLoadDelete },
				size   : { get : onLoadSize }
			}))
		},
		onSave : {
			value : Object.freeze(objectDefineProperties({}, {
				add    : { value : onSaveAdd },
				clear  : { value : onSaveClear },
				delete : { value : onSaveDelete },
				size   : { get : onSaveSize }
			}))
		}
	}));
})();
