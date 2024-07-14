import { getLogger } from '../../logging/logger';

const logger = getLogger('DEFAULT');

export type StoreValue = object;

export interface Adapter {
  delete(value: string): boolean;
  set(key: string, value: StoreValue): boolean;
  get(key: string): StoreValue;
  has(key: string): boolean;
  init: (storageId: string, persistent: boolean) => boolean;
  create: (storageId: string, persistent: boolean) => Adapter;
}

// const inMemoryStores: {[index: string]: Map<string, object>} = {};

class InMemoryStorageAdapterImpl implements Adapter {
  inMemoryStore = new Map<string, object>();
  init(storageId: string, persistent: boolean): boolean {
    this.inMemoryStore.clear();
    return true;
  }
  create(storageId: string, persistent: boolean): Adapter {
    return this;
  }
  delete(key: string): boolean {
    return this.inMemoryStore.delete(key);
  }
  set(key: string, value: object): boolean {
    this.inMemoryStore.set(key, value);
    return true;
  }
  get(key: string): object {
    return this.inMemoryStore.get(key);
  }
  has(key: string): boolean {
    return this.inMemoryStore.has(key);
  }
}

export const InMemoryStorageAdapter = new InMemoryStorageAdapterImpl();

export const FakeStorageAdapter: Adapter = {
  init: function (storageId: string, persistent: boolean): boolean {
    logger.debug('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },

  create: function (storageId: string, persistent: boolean): Adapter {
    return this;
  },

  delete: function (value: string): boolean {
    logger.debug('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },
  set: function (key: string, value: object): boolean {
    logger.debug('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },
  get: function (key: string): object {
    logger.debug('InMemoryStorageAdapter: Function not implemented.');
    return null;
  },
  has: function (key: string): boolean {
    logger.debug('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },
};
