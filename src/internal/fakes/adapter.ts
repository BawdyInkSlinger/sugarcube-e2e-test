import { getLogger } from '../../logging/logger';
import { SaveAPI } from '../declarations/twine-sugarcube-copy/save';

const logger = getLogger('DEFAULT');

export type StoreValue = object;
type KeyValue = {
  saves: SaveAPI;
  options: StoreValue;
  settings: StoreValue;
  remember: StoreValue;
  metadata: StoreValue;
};

export interface Adapter {
  name: string;
  delete(value: keyof KeyValue): boolean;
  set<Key extends keyof KeyValue>(key: Key, value: KeyValue[Key]): boolean;
  get<Key extends keyof KeyValue>(key: Key): KeyValue[Key] | null;
  has(key: keyof KeyValue): boolean;
  init: (storageId: string, persistent: boolean) => boolean;
  create: (storageId: string, persistent: boolean) => Adapter;
}

class InMemoryStorageAdapterImpl implements Adapter {
  name: 'InMemoryStorageAdapterImpl';
  inMemoryStore = new Map<keyof KeyValue, KeyValue[keyof KeyValue]>();
  init(storageId: string, persistent: boolean): boolean {
    logger.debug(
      `InMemoryStorageAdapterImpl/init(${storageId}, ${persistent}})`
    );
    this.inMemoryStore.clear();
    return true;
  }
  create(storageId: string, persistent: boolean): Adapter {
    return this;
  }
  delete(key: keyof KeyValue): boolean {
    return this.inMemoryStore.delete(key);
  }
  set<Key extends keyof KeyValue>(key: Key, value: object): boolean {
    this.inMemoryStore.set(key, value);
    return true;
  }
  get<Key extends keyof KeyValue>(key: Key): KeyValue[Key] {
    return this.inMemoryStore.get(key) as KeyValue[Key] ?? null;
  }
  has(key: keyof KeyValue): boolean {
    return this.inMemoryStore.has(key);
  }
  toString() {
    return (
      `{` +
      [...this.inMemoryStore]
        .map((entry) => {
          return `\n  ${entry[0]}: ${entry[1]},`;
        })
        .join('') +
      `}`
    );
  }
}

export const InMemoryStorageAdapter = new InMemoryStorageAdapterImpl();
