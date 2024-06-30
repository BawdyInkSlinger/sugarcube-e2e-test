import { getLogger } from '../../../../logging/logger';
import './can-strings-be-monkey-patched';
import strings = require('jsdom/lib/jsdom/living/helpers/strings.js');

const logger = getLogger('DEFAULT');

if (process.env['JSDOM_NAIVE_STRINGS_IMPLEMENTATION'] === `true`) {
  logger.info(`Using JSDOM naive strings.js implementation for faster performance`);
  strings.asciiLowercase = (s: string) => {
    return s.toLowerCase();
  };

  strings.asciiUppercase = (s: string) => {
    return s.toUpperCase();
  };
} else {
  logger.info(`Using builtin JSDOM strings.js implementation`);
}
