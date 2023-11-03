import { SaveAPI, SaveDetails, SaveObject } from '../declarations/twine-sugarcube-copy/save';
import { DEBUG } from '../../constants';

export const Save: SaveAPI = {
  MAX_IDX: -1,
  clear: function (): void {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
  },
  get: function (): object {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
    return this;
  },
  ok: function (): boolean {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
    return true;
  },
  onLoad: {
    add: function (handler: (save: SaveObject) => void): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    clear: function (): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    delete: function (handler: (save: SaveObject) => void): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    size: 0
  },
  onSave: {
    add: function (handler: (save: SaveObject, details: SaveDetails) => void): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    clear: function (): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    delete: function (handler: (save: SaveObject, details: SaveDetails) => void): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    size: 0
  },
  slots: {
    length: 8,
    count: function (): number {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return 8;
    },
    delete: function (slot: number): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    get: function (slot: number): SaveObject {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return {} as SaveObject;
    },
    has: function (slot: number): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    isEmpty: function (): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return false;
    },
    load: function (slot: number): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    ok: function (): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    save: function (slot: number, title?: string, metadata?: any): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    }
  },
  autosave: {
    delete: function (): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    get: function (): SaveObject {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return {} as SaveObject;
    },
    has: function (): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    load: function (): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    },
    ok: function (): boolean {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
      return true;
    },
    save: function (title?: string, metadata?: any): void {
      DEBUG && console.log('FAKE SAVE: Function not implemented.');
    }
  },
  export: function (filename?: string, metadata?: any): void {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
  },
  import: function (event: Event): void {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
  },
  serialize: function (metadata?: any): string {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
    return "FAKE SAVE";
  },
  deserialize: function (saveStr: string) {
    DEBUG && console.log('FAKE SAVE: Function not implemented.');
  },
}