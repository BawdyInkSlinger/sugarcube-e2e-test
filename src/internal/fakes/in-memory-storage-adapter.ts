import { DEBUG } from '../../constants';

export type StoreValue = object;

export type Adapter = {
  delete(value: string): boolean;
  set(key: string, value: StoreValue): boolean;
  get(key: string): StoreValue;
  init: (storageId: string, persistent: boolean) => boolean;
  create: (storageId: string, persistent: boolean) => Adapter;
};

export const InMemoryStorageAdapter: Adapter = {
  init: function (storageId: string, persistent: boolean): boolean {
    DEBUG && console.log('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },

  create: function (storageId: string, persistent: boolean): Adapter {
    return this;
  },
  
  delete: function (value: string): boolean {
    DEBUG && console.log('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },
  set: function (key: string, value: object): boolean {
    DEBUG && console.log('InMemoryStorageAdapter: Function not implemented.');
    return true;
  },
  get: function (key: string): object {
    DEBUG && console.log('InMemoryStorageAdapter: Function not implemented.');
    return null;
  }
}