/***********************************************************************************************************************

	config.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Save, Util */

import {
  LoadHandler,
  SaveHandler,
} from './declarations/twine-sugarcube-copy/save';
import { Save } from './save';
import { Util } from './util';

export const Config = (() => {
  // eslint-disable-line no-unused-vars, no-var
  'use strict';

  // General settings.
  let _debug = false;
  let _addVisitedLinkClass = false;
  let _cleanupWikifierOutput = false;
  let _loadDelay = 0;

  // Audio settings.
  let _audioPauseOnFadeToZero = true;
  let _audioPreloadMetadata = true;

  // State history settings.
  let _historyControls = true;
  let _historyMaxStates = 40;

  // Macros settings.
  let _macrosIfAssignmentError = true;
  let _macrosMaxLoopIterations = 1000;
  let _macrosTypeSkipKey = '\x20'; // Space
  let _macrosTypeVisitedPassages = true;

  // Navigation settings.
  let _navigationOverride;

  // Passages settings.
  let _passagesDescriptions;
  let _passagesDisplayTitles = false;
  let _passagesNobr = false;
  let _passagesStart; // set by `Story.load()`
  let _passagesOnProcess;
  let _passagesTransitionOut;

  // Saves settings.
  let _savesAutoload;
  let _savesAutosave;
  let _savesId = 'untitled-story';
  let _savesIsAllowed;
  let _savesSlots = 8;
  let _savesTryDiskOnMobile = true;
  let _savesVersion;

  // UI settings.
  let _uiStowBarInitially = 800;
  let _uiUpdateStoryElements = true;

  // added by BIS
  function initialize() {
    _debug = false;
    _addVisitedLinkClass = false;
    _cleanupWikifierOutput = false;
    _loadDelay = 0;

    // Audio settings.
    _audioPauseOnFadeToZero = true;
    _audioPreloadMetadata = true;

    // State history settings.
    _historyControls = true;
    _historyMaxStates = 40;

    // Macros settings.
    _macrosIfAssignmentError = true;
    _macrosMaxLoopIterations = 1000;
    _macrosTypeSkipKey = '\x20'; // Space
    _macrosTypeVisitedPassages = true;

    // Navigation settings.
    _navigationOverride = undefined;

    // Passages settings.
    _passagesDescriptions = undefined;
    _passagesDisplayTitles = false;
    _passagesNobr = false;
    _passagesStart = undefined; // set by `Story.load()`
    _passagesOnProcess = undefined;
    _passagesTransitionOut = undefined;

    // Saves settings.
    _savesAutoload = undefined;
    _savesAutosave = undefined;
    _savesId = 'untitled-story';
    _savesIsAllowed = undefined;
    _savesSlots = 8;
    _savesTryDiskOnMobile = true;
    _savesVersion = undefined;

    // UI settings.
    _uiStowBarInitially = 800;
    _uiUpdateStoryElements = true;
  }

  /*******************************************************************************
		Error Constants.
	*******************************************************************************/

  const _errHistoryModeDeprecated =
    'Config.history.mode has been deprecated and is no longer used by SugarCube, please remove it from your code';
  const _errHistoryTrackingDeprecated =
    'Config.history.tracking has been deprecated, use Config.history.maxStates instead';
  const _errSavesOnLoadDeprecated =
    'Config.saves.onLoad has been deprecated, use the Save.onLoad API instead';
  const _errSavesOnSaveDeprecated =
    'Config.saves.onSave has been deprecated, use the Save.onSave API instead';

  /*******************************************************************************
		Object Exports.
	*******************************************************************************/

  return Object.freeze({
    /*
			General settings.
		*/
    get reset() {
      return initialize;
    },
    get debug() {
      return _debug;
    },
    set debug(value) {
      _debug = Boolean(value);
    },

    get addVisitedLinkClass() {
      return _addVisitedLinkClass;
    },
    set addVisitedLinkClass(value) {
      _addVisitedLinkClass = Boolean(value);
    },

    get cleanupWikifierOutput() {
      return _cleanupWikifierOutput;
    },
    set cleanupWikifierOutput(value) {
      _cleanupWikifierOutput = Boolean(value);
    },

    get loadDelay() {
      return _loadDelay;
    },
    set loadDelay(value) {
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new RangeError('Config.loadDelay must be a non-negative integer');
      }

      _loadDelay = value;
    },

    /*
			Audio settings.
		*/
    audio: Object.freeze({
      get pauseOnFadeToZero() {
        return _audioPauseOnFadeToZero;
      },
      set pauseOnFadeToZero(value) {
        _audioPauseOnFadeToZero = Boolean(value);
      },

      get preloadMetadata() {
        return _audioPreloadMetadata;
      },
      set preloadMetadata(value) {
        _audioPreloadMetadata = Boolean(value);
      },
    }),

    /*
			State history settings.
		*/
    history: Object.freeze({
      // TODO: (v3) This should be under UI settings → `Config.ui.historyControls`.
      get controls() {
        return _historyControls;
      },
      set controls(value) {
        const controls = Boolean(value);

        if (_historyMaxStates === 1 && controls) {
          throw new Error(
            'Config.history.controls must be false when Config.history.maxStates is 1'
          );
        }

        _historyControls = controls;
      },

      get maxStates() {
        return _historyMaxStates;
      },
      set maxStates(value) {
        if (!Number.isSafeInteger(value) || value < 1) {
          throw new RangeError(
            'Config.history.maxStates must be a positive integer'
          );
        }

        _historyMaxStates = value;

        // Force `Config.history.controls` to `false`, when limited to `1` moment.
        if (_historyControls && value === 1) {
          _historyControls = false;
        }
      },

      // legacy
      // Die if deprecated state history settings are accessed.
      get mode() {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errHistoryModeDeprecated);
        console.error(_errHistoryModeDeprecated);
        return;
      },
      set mode(_) {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errHistoryModeDeprecated);
        console.error(_errHistoryModeDeprecated);
        return;
      },
      get tracking() {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errHistoryTrackingDeprecated);
        console.error(_errHistoryTrackingDeprecated);
        return;
      },
      set tracking(_) {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errHistoryTrackingDeprecated);
        console.error(_errHistoryTrackingDeprecated);
        return;
      },
      // /legacy
    }),

    /*
			Macros settings.
		*/
    macros: Object.freeze({
      get ifAssignmentError() {
        return _macrosIfAssignmentError;
      },
      set ifAssignmentError(value) {
        _macrosIfAssignmentError = Boolean(value);
      },

      get maxLoopIterations() {
        return _macrosMaxLoopIterations;
      },
      set maxLoopIterations(value) {
        if (!Number.isSafeInteger(value) || value < 1) {
          throw new RangeError(
            'Config.macros.maxLoopIterations must be a positive integer'
          );
        }

        _macrosMaxLoopIterations = value;
      },

      get typeSkipKey() {
        return _macrosTypeSkipKey;
      },
      set typeSkipKey(value) {
        _macrosTypeSkipKey = String(value);
      },

      get typeVisitedPassages() {
        return _macrosTypeVisitedPassages;
      },
      set typeVisitedPassages(value) {
        _macrosTypeVisitedPassages = Boolean(value);
      },
    }),

    /*
			Navigation settings.
		*/
    navigation: Object.freeze({
      get override() {
        return _navigationOverride;
      },
      set override(value) {
        if (!(value == null || value instanceof Function)) {
          // lazy equality for null
          throw new TypeError(
            `Config.navigation.override must be a function or null/undefined (received: ${Util.getType(
              value
            )})`
          );
        }

        _navigationOverride = value;
      },
    }),

    /*
			Passages settings.
		*/
    passages: Object.freeze({
      get descriptions() {
        return _passagesDescriptions;
      },
      set descriptions(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          if (
            valueType !== 'boolean' &&
            valueType !== 'Object' &&
            valueType !== 'function'
          ) {
            throw new TypeError(
              `Config.passages.descriptions must be a boolean, object, function, or null/undefined (received: ${valueType})`
            );
          }
        }

        _passagesDescriptions = value;
      },

      // TODO: (v3) This should be under Navigation settings → `Config.navigation.updateTitle`.
      get displayTitles() {
        return _passagesDisplayTitles;
      },
      set displayTitles(value) {
        _passagesDisplayTitles = Boolean(value);
      },

      get nobr() {
        return _passagesNobr;
      },
      set nobr(value) {
        _passagesNobr = Boolean(value);
      },

      get onProcess() {
        return _passagesOnProcess;
      },
      set onProcess(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          if (valueType !== 'function') {
            throw new TypeError(
              `Config.passages.onProcess must be a function or null/undefined (received: ${valueType})`
            );
          }
        }

        _passagesOnProcess = value;
      },

      // TODO: (v3) This should be under Navigation settings → `Config.navigation.(start|startingPassage)`.
      get start() {
        return _passagesStart;
      },
      set start(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          if (valueType !== 'string') {
            throw new TypeError(
              `Config.passages.start must be a string or null/undefined (received: ${valueType})`
            );
          }
        }

        _passagesStart = value;
      },

      // TODO: (v3) This should be under Navigation settings → `Config.navigation.transitionOut`.
      get transitionOut() {
        return _passagesTransitionOut;
      },
      set transitionOut(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          if (
            valueType !== 'string' &&
            (valueType !== 'number' ||
              !Number.isSafeInteger(value) ||
              value < 0)
          ) {
            throw new TypeError(
              `Config.passages.transitionOut must be a string, non-negative integer, or null/undefined (received: ${valueType})`
            );
          }
        }

        _passagesTransitionOut = value;
      },
    }),

    /*
			Saves settings.
		*/
    saves: Object.freeze({
      get autoload() {
        return _savesAutoload;
      },
      set autoload(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          if (
            valueType !== 'boolean' &&
            valueType !== 'string' &&
            valueType !== 'function'
          ) {
            throw new TypeError(
              `Config.saves.autoload must be a boolean, string, function, or null/undefined (received: ${valueType})`
            );
          }
        }

        _savesAutoload = value;
      },

      get autosave() {
        return _savesAutosave;
      },
      set autosave(value) {
        if (value != null) {
          // lazy equality for null
          const valueType = Util.getType(value);

          // legacy
          // Convert a string value to an Array of string.
          if (valueType === 'string') {
            _savesAutosave = [value];
            return;
          }
          // /legacy

          if (
            valueType !== 'boolean' &&
            (valueType !== 'Array' ||
              !value.every((item) => typeof item === 'string')) &&
            valueType !== 'function'
          ) {
            throw new TypeError(
              `Config.saves.autosave must be a boolean, Array<string>, function, or null/undefined (received: ${valueType}${
                valueType === 'Array' ? '<any>' : ''
              })`
            );
          }
        }

        _savesAutosave = value;
      },

      get id() {
        return _savesId;
      },
      set id(value) {
        if (typeof value !== 'string' || value === '') {
          throw new TypeError(
            `Config.saves.id must be a non-empty string (received: ${Util.getType(
              value
            )})`
          );
        }

        _savesId = value;
      },

      get isAllowed() {
        return _savesIsAllowed;
      },
      set isAllowed(value) {
        if (!(value == null || value instanceof Function)) {
          // lazy equality for null
          throw new TypeError(
            `Config.saves.isAllowed must be a function or null/undefined (received: ${Util.getType(
              value
            )})`
          );
        }

        _savesIsAllowed = value;
      },

      get slots() {
        return _savesSlots;
      },
      set slots(value) {
        if (!Number.isSafeInteger(value) || value < 0) {
          throw new TypeError(
            `Config.saves.slots must be a non-negative integer (received: ${Util.getType(
              value
            )})`
          );
        }

        _savesSlots = value;
      },

      get tryDiskOnMobile() {
        return _savesTryDiskOnMobile;
      },
      set tryDiskOnMobile(value) {
        _savesTryDiskOnMobile = Boolean(value);
      },

      get version() {
        return _savesVersion;
      },
      set version(value) {
        _savesVersion = value;
      },

      // legacy
      // Die if deprecated saves onLoad handler getter is accessed.
      get onLoad(): LoadHandler {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errSavesOnLoadDeprecated);
        console.error(_errSavesOnLoadDeprecated);
        return;
      },
      // Warn if deprecated saves onLoad handler setter is assigned to, then
      // pass the handler to the `Save.onLoad` API for compatibilities sake.
      set onLoad(value) {
        console.warn(_errSavesOnLoadDeprecated);
        Save.onLoad.add(value);
      },

      // Die if deprecated saves onSave handler getter is accessed.
      get onSave(): SaveHandler {
        // Changed by BIS to prevent reset-global.ts logs from throwing an error.
        // Original: throw new Error(_errSavesOnSaveDeprecated);
        console.error(_errSavesOnSaveDeprecated);
        return;
      },
      // Warn if deprecated saves onSave handler setter is assigned to, then
      // pass the handler to the `Save.onSave` API for compatibilities sake.
      set onSave(value: SaveHandler) {
        console.warn(_errSavesOnSaveDeprecated);
        Save.onSave.add(value);
      },
      // /legacy
    }),

    /*
			UI settings.
		*/
    ui: Object.freeze({
      get stowBarInitially() {
        return _uiStowBarInitially;
      },
      set stowBarInitially(value) {
        const valueType = Util.getType(value);

        if (
          valueType !== 'boolean' &&
          (valueType !== 'number' || !Number.isSafeInteger(value) || value < 0)
        ) {
          throw new TypeError(
            `Config.ui.stowBarInitially must be a boolean or non-negative integer (received: ${valueType})`
          );
        }

        _uiStowBarInitially = value;
      },

      get updateStoryElements() {
        return _uiUpdateStoryElements;
      },
      set updateStoryElements(value) {
        _uiUpdateStoryElements = Boolean(value);
      },
    }),
  });
})();
