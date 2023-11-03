/***********************************************************************************************************************

	macro/macro.js

	Copyright © 2013–2022 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/
/* global Patterns, Scripting, macros */

import { macros } from '../macros';
import { Patterns } from '../patterns';
import { Scripting } from '../scripting';
import { objectCreateNull } from '../util/object-create-null';

const Macro = (() => {
  // eslint-disable-line no-unused-vars, no-var
  // Macro definitions.
  const _macros = {};

  // Map of all macro tags and their parents (key: 'tag name' => value: ['list of parent names']).
  const _tags = {};

  // Valid macro name regular expression.
  const _validNameRe = new RegExp(`^(?:${Patterns.macroName})$`);

  /*******************************************************************************
		Macros Functions.
	*******************************************************************************/

  function macrosAdd<DEF>(name: string[] | string, def: DEF | string) {
    if (Array.isArray(name)) {
      name.forEach((name) => macrosAdd(name, def));
      return;
    }

    if (!_validNameRe.test(name)) {
      throw new Error(`invalid macro name "${name}"`);
    }

    if (macrosHas(name)) {
      throw new Error(`cannot clobber existing macro <<${name}>>`);
    } else if (tagsHas(name)) {
      throw new Error(
        `cannot clobber child tag <<${name}>> of parent macro${
          _tags[name].length === 1 ? '' : 's'
        } <<${_tags[name].join('>>, <<')}>>`
      );
    }

    try {
      if (isObjectDefinition(def)) {
        // Add the macro definition.
        //
        // NOTE: Since `macrosGet()` may return legacy macros, we add the `_MACRO_API`
        // flag to (modern) API macros, so that the macro formatter will know how to
        // call the macro.  This should be removed in v3.
        _macros[name] = Object.assign(Object.create(null), def, {
          _MACRO_API: true,
        });
      } else {
        // Add the macro alias.
        if (macrosHas(def)) {
          _macros[name] = Object.create(_macros[def], {
            _ALIAS_OF: {
              enumerable: true,
              value: def,
            },
          });
        } else {
          throw new Error(
            `cannot create alias of nonexistent macro <<${def}>>`
          );
        }
      }

      Object.defineProperty(_macros, name, { writable: false });
    } catch (ex: any) {
      if (ex.name === 'TypeError') {
        throw new Error(`cannot clobber protected macro <<${name}>>`);
      } else {
        throw new Error(
          `unknown error when attempting to add macro <<${name}>>: [${ex.name}] ${ex.message}`
        );
      }
    }

    // Tags post-processing.
    if (typeof _macros[name].tags !== 'undefined') {
      if (_macros[name].tags == null) {
        // lazy equality for null
        tagsRegister(name);
      } else if (Array.isArray(_macros[name].tags)) {
        tagsRegister(name, _macros[name].tags);
      } else {
        throw new Error(`bad value for "tags" property of macro <<${name}>>`);
      }
    }
  }

  function macrosDelete(name: string[] | string) {
    if (Array.isArray(name)) {
      name.forEach((name) => macrosDelete(name));
      return;
    }

    if (macrosHas(name)) {
      // Tags pre-processing.
      if (typeof _macros[name].tags !== 'undefined') {
        tagsUnregister(name);
      }

      try {
        // Remove the macro definition.
        Object.defineProperty(_macros, name, { writable: true });
        delete _macros[name];
      } catch (ex: any) {
        throw new Error(
          `unknown error removing macro <<${name}>>: ${ex.message}`
        );
      }
    } else if (tagsHas(name)) {
      throw new Error(
        `cannot remove child tag <<${name}>> of parent macro <<${_tags[name]}>>`
      );
    }
  }

  function macrosIsEmpty() {
    return Object.keys(_macros).length === 0;
  }

  function macrosHas(name: string) {
    return Object.hasOwn(_macros, name);
  }

  function macrosGet(name: string) {
    let macro = null;

    if (macrosHas(name) && typeof _macros[name].handler === 'function') {
      macro = _macros[name];
    } else if (
      /* legacy macro support */
      Object.hasOwn(macros, name) &&
      typeof macros[name].handler === 'function'
    ) {
      macro = macros[name];
    }
    /* /legacy macro support */

    return macro;
  }

  function macrosInit(handler = 'init') {
    // eslint-disable-line no-unused-vars
    Object.keys(_macros).forEach((name) => {
      if (typeof _macros[name][handler] === 'function') {
        _macros[name][handler](name);
      }
    });

    /* legacy macro support */
    Object.keys(macros).forEach((name) => {
      if (typeof macros[name][handler] === 'function') {
        macros[name][handler](name);
      }
    });
    /* /legacy macro support */
  }

  /*******************************************************************************
		Tags Functions.
	*******************************************************************************/

  function tagsRegister(parent, bodyTags?) {
    if (!parent) {
      throw new Error('no parent specified');
    }

    const endTags = [`/${parent}`, `end${parent}`]; // automatically create the closing tags
    const allTags = [].concat(endTags, Array.isArray(bodyTags) ? bodyTags : []);

    for (let i = 0; i < allTags.length; ++i) {
      const tag = allTags[i];

      if (macrosHas(tag)) {
        throw new Error('cannot register tag for an existing macro');
      }

      if (tagsHas(tag)) {
        if (!_tags[tag].includes(parent)) {
          _tags[tag].push(parent);
          _tags[tag].sort();
        }
      } else {
        _tags[tag] = [parent];
      }
    }
  }

  function tagsUnregister(parent) {
    if (!parent) {
      throw new Error('no parent specified');
    }

    Object.keys(_tags).forEach((tag) => {
      const i = _tags[tag].indexOf(parent);

      if (i !== -1) {
        if (_tags[tag].length === 1) {
          delete _tags[tag];
        } else {
          _tags[tag].splice(i, 1);
        }
      }
    });
  }

  function tagsHas(name) {
    return Object.hasOwn(_tags, name);
  }

  function tagsGet(name) {
    return tagsHas(name) ? _tags[name] : null;
  }

  /*******************************************************************************
		Object Exports.
	*******************************************************************************/

  return Object.preventExtensions(
    objectCreateNull(null, {
      /*
			Macro Functions.
		*/
      add: { value: macrosAdd },
      delete: { value: macrosDelete },
      isEmpty: { value: macrosIsEmpty },
      has: { value: macrosHas },
      get: { value: macrosGet },
      init: { value: macrosInit },

      /*
			Tags Functions.
		*/
      tags: {
        value: Object.preventExtensions(
          objectCreateNull(null, {
            register: { value: tagsRegister },
            unregister: { value: tagsUnregister },
            has: { value: tagsHas },
            get: { value: tagsGet },
          })
        ),
      },

      /*
			Legacy Aliases.
		*/
      evalStatements: {
        value: (...args) =>
          Scripting.evalJavaScript(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ...args
          ),
      }, // SEE: `markup/scripting.js`.
    })
  );
})();

function isObjectDefinition<T>(def: T | string): def is T {
  return typeof def !== 'string';
}

export { Macro };
