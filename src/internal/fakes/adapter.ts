import { getLogger } from '../../logging/logger';
import { SaveAPI } from '../declarations/twine-sugarcube-copy/save';

const logger = getLogger('DEFAULT');

export type StoreValue = object;
type KeyValue = {
  saves: SaveAPI;
  state: StoreValue;
  options: StoreValue;
  settings: StoreValue;
  remember: StoreValue;
  metadata: StoreValue;
};
type Keys = keyof KeyValue;

export interface Adapter {
  name: string;
  init: (storageId: string, persistent: boolean) => boolean;
  create: (storageId: string, persistent: boolean) => Adapter;
  delete(value: Keys): boolean;
  set<Key extends Keys>(key: Key, value: KeyValue[Key]): boolean;
  get<Key extends Keys>(key: Key): KeyValue[Key] | null;
  has(key: Keys): boolean;
}

class InMemoryStorageAdapterImpl implements Adapter {
  name: 'InMemoryStorageAdapterImpl';
  inMemoryStore = new Map<Keys, KeyValue[Keys]>();
  init(storageId: string, persistent: boolean): boolean {
    logger.debug(
      `InMemoryStorageAdapterImpl/init(${storageId}, ${persistent}})`
    );
    this.inMemoryStore.clear();
    return true;
  }

  create(storageId: string, persistent: boolean): Adapter {
    logger.debug(
      `InMemoryStorageAdapterImpl/create(${storageId}, ${persistent}})`
    );
    this.inMemoryStore.clear();
    return this;
  }
  delete(key: Keys): boolean {
    return this.inMemoryStore.delete(key);
  }
  set<Key extends Keys>(key: Key, value: object): boolean {
    this.inMemoryStore.set(key, value);
    return true;
  }
  get<Key extends Keys>(key: Key): KeyValue[Key] {
    return (this.inMemoryStore.get(key) as KeyValue[Key]) ?? null;
  }
  has(key: Keys): boolean {
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
