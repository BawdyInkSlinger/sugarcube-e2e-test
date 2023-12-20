import { DEBUG_SUGARCUBE_PARSER_TESTS_KEY } from '../src/internal/test-logger-key';

const logLevels = new Map<string, 'debug' | 'info' | 'warn' | 'error'>([
  ['DEFAULT', 'warn'],
  ['DEBUG_TRIGGER_TIMEOUT', 'warn'],
  ['DEBUG_EVAL', 'warn'],
  ['DEBUG_PASSAGES', 'warn'],
  ['DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES', 'warn'],
  ['DEBUG_SELECTOR_ENTER_LOG_MESSAGES', 'warn'],
  ['DEBUG_ASSERTIONS_ENTER_LOG_MESSAGES', 'warn'],
  ['DEBUG_HAS_VISITED', 'warn'],
  ['DEBUG_THIS_AS_PROMISE', 'warn'],
  [DEBUG_SUGARCUBE_PARSER_TESTS_KEY, 'warn'],
]);

logLevels.forEach((value, key) => {
  process.env[`logger.${key}.level`] = value;
});
