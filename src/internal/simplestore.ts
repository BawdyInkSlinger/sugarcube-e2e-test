/***********************************************************************************************************************

	lib/simplestore/simplestore.js

	Copyright © 2013–2021 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License, which may be found in the LICENSE file.

***********************************************************************************************************************/

import { getLogger } from '../logging/logger';
import { Adapter } from './fakes/adapter';
import { objectDefineProperties } from './utils/object-define-properties';

const logger = getLogger();

export const SimpleStore = (() => {
  // eslint-disable-line no-unused-vars, no-var
  'use strict';

  // In-order list of database adapters.
  const _adapters: Adapter[] = [];

  // The initialized adapter.
  let _initialized = null;

  /*******************************************************************************************************************
		SimpleStore Functions.
	*******************************************************************************************************************/
  function storeCreate(storageId: string, persistent: boolean) {
    logger.debug(`SimpleStore.storeCreate: storageId=${storageId} persistent=${persistent} _initialized=${JSON.stringify(_initialized)}`);
    if (_initialized) {
      return _initialized.create(storageId, persistent);
    }

    // Return the first adapter which successfully initializes, elsewise throw an exception.
    for (let i = 0; i < _adapters.length; ++i) {
      if (_adapters[i].init(storageId, persistent)) {
        _initialized = _adapters[i];
        return _initialized.create(storageId, persistent);
      }
    }

    throw new Error('no valid storage adapters found');
  }

  /*******************************************************************************************************************
		Module Exports.
	*******************************************************************************************************************/
  return Object.freeze(
    objectDefineProperties(
      {},
      {
        /*
			Adapters List.

			TODO: This should probably have a getter, rather than being exported directly.
		*/
        adapters: { value: _adapters },

        /*
			Core Functions.
		*/
        create: { value: storeCreate },
      }
    )
  );
})();
