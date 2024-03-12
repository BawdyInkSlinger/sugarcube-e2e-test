import { createLogger, Logger, format, transports } from 'winston';
import { logPrefix } from './log-prefix';

export type Category =
  | 'DEFAULT'
  | 'DEBUG_TRIGGER_TIMEOUT'
  | 'DEBUG_PASSAGES'
  | 'DEBUG_EVAL'
  | 'DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES'
  | 'DEBUG_ASSERTIONS_ENTER_LOG_MESSAGES'
  | 'DEBUG_SELECTOR_ENTER_LOG_MESSAGES'
  | 'DEBUG_SELECTOR_EXECUTION_LOG_MESSAGES'
  | 'DEBUG_HAS_VISITED'
  | 'DEBUG_THIS_AS_PROMISE'
  | 'DEBUG_INNER_TEXT'
  | 'DEBUG_INNER_TEXT_TABLE_RECURSIVE';

const logLevels = ['error', 'warn', 'info', 'debug'] as const;
export type LogLevel = (typeof logLevels)[number];

export const getLogger = (categoryName: Category = 'DEFAULT'): Logger => {
  if (getEnvLevelValue('DEFAULT') === undefined) {
    throw new Error(
      `Logger Configuration Error: Environment Variable '${getEnvLevelKey(
        'DEFAULT'
      )}' does not exist.`
    );
  }

  const configuredLevel = getEnvLevelValue(categoryName);
  if (configuredLevel === undefined) {
    getLogger('DEFAULT').warn(
      `Environment Variable '${getEnvLevelKey(
        categoryName
      )}' does not exist. Defaulting to 'debug'.`
    );
  }

  return loggerPool.get(configuredLevel ?? 'debug');
};

const buildLoggerOptions = (configuredLevel: LogLevel) => {
  return {
    level: configuredLevel,
    format: format.combine(logPrefix(), format.simple()),
    transports: new transports.Console(),
    exceptionHandlers: new transports.Console(),
    rejectionHandlers: new transports.Console(),
    exitOnError: false,
  };
};

const loggerPool = new Map<LogLevel, Logger>([
  ['debug', createLogger(buildLoggerOptions('debug'))],
  ['info', createLogger(buildLoggerOptions('info'))],
  ['warn', createLogger(buildLoggerOptions('warn'))],
  ['error', createLogger(buildLoggerOptions('error'))],
]);

const getEnvLevelKey = (categoryName: Category): string => {
  return `logger.${categoryName}.level`;
};

const getEnvLevelValue = (categoryName: Category): LogLevel | undefined => {
  const value = process.env[getEnvLevelKey(categoryName)];

  if (value === undefined) {
    return undefined;
  } else if (includes(logLevels, value)) {
    return value;
  }
  throw new Error(
    `Invalid value for getEnvLevelKey(categoryName): '${getEnvLevelKey(
      categoryName
    )}' Expected one of ${logLevels}`
  );
};

function includes<S extends string>(
  haystack: readonly S[],
  needle: string
): needle is S {
  const _haystack: readonly string[] = haystack;
  return _haystack.includes(needle);
}
