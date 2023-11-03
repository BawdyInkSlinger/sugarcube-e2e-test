import { ListDefinition, RangeDefinition, SettingsAPI, ToggleDefinition } from '../declarations/twine-sugarcube-copy/settings';
import { DEBUG } from '../../constants';

export const Setting: SettingsAPI = {
  addHeader: function (name: string, desc?: string): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  addToggle: function (name: string, definition: ToggleDefinition): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  addList: function <T>(name: string, definition: ListDefinition<T>): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  addRange: function (name: string, definition: RangeDefinition): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  load: function (): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  reset: function (name?: string): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  },
  save: function (): void {
    DEBUG && console.log('FAKE SETTING: Function not implemented.');
  }
}