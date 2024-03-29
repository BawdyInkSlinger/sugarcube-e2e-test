import { getLogger } from '../../logging/logger';
import {
  ListDefinition,
  RangeDefinition,
  SettingsAPI,
  ToggleDefinition,
} from '../declarations/twine-sugarcube-copy/settings';

const logger = getLogger('DEFAULT');

export const Setting: SettingsAPI = {
  addHeader: function (name: string, desc?: string): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  addToggle: function (name: string, definition: ToggleDefinition): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  addList: function <T>(name: string, definition: ListDefinition<T>): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  addRange: function (name: string, definition: RangeDefinition): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  load: function (): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  reset: function (name?: string): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
  save: function (): void {
    logger.info('FAKE SETTING: Function not implemented.');
  },
};
