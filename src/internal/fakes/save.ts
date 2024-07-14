import { getLogger } from '../../logging/logger';
import {
  SaveAPI,
  SaveDetails,
  SaveObject,
} from '../declarations/twine-sugarcube-copy/save';

const logger = getLogger('DEFAULT');

export const Save: SaveAPI = {
  MAX_IDX: -1,
  clear: function (): void {
    logger.info('FAKE SAVE: Function not implemented.');
  },
  get: function (): SaveAPI {
    logger.info('FAKE SAVE: Function not implemented.');
    return this;
  },
  ok: function (): boolean {
    logger.info('FAKE SAVE: Function not implemented.');
    return true;
  },
  onLoad: {
    add: function (handler: (save: SaveObject) => void): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    clear: function (): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    delete: function (handler: (save: SaveObject) => void): boolean {
      logger.info('FAKE SAVE: Function not implemented.');
      return true;
    },
    size: 0,
  },
  onSave: {
    add: function (
      handler: (save: SaveObject, details: SaveDetails) => void
    ): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    clear: function (): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    delete: function (
      handler: (save: SaveObject, details: SaveDetails) => void
    ): boolean {
      logger.info('FAKE SAVE: Function not implemented.');
      return true;
    },
    size: 0,
  },
  slots: {
    length: 8,
    count: function (): number {
      logger.info('FAKE SAVE: Function not implemented.');
      return 8;
    },
    delete: function (slot: number): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    get: function (slot: number): SaveObject {
      logger.info('FAKE SAVE: Function not implemented.');
      return {} as SaveObject;
    },
    has: function (slot: number): boolean {
      logger.info('FAKE SAVE: Function not implemented.');
      return true;
    },
    isEmpty: function (): boolean {
      logger.info('FAKE SAVE: Function not implemented.');
      return false;
    },
    load: function (slot: number): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
    ok: function (): boolean {
      logger.info('FAKE SAVE: Function not implemented.');
      return true;
    },
    save: function (slot: number, title?: string, metadata?: any): void {
      logger.info('FAKE SAVE: Function not implemented.');
    },
  },
  autosave: {
      delete: function (): void {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
      },
      get: function (): SaveObject {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
          return {} as SaveObject;
      },
      has: function (): boolean {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
          return true;
      },
      load: function (): boolean {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
          return true;
      },
      ok: function (): boolean {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
          return true;
      },
      save: function (title?: string, metadata?: any): void {
          logger.info('FAKE AUTOSAVE: Function not implemented.');
      },
      title: 'FAKE AUTOSAVE',
      date: new Date(),
  },
  export: function (filename?: string, metadata?: any): void {
    logger.info('FAKE SAVE: Function not implemented.');
  },
  import: function (event: Event): void {
    logger.info('FAKE SAVE: Function not implemented.');
  },
  serialize: function (metadata?: any): string {
    logger.info('FAKE SAVE: Function not implemented.');
    return 'FAKE SAVE';
  },
  deserialize: function (saveStr: string) {
    logger.info('FAKE SAVE: Function not implemented.');
  },
};
