import { Container, Logger, format, transports } from 'winston';

const container = new Container();

export type Category =
  | 'DEFAULT'
  | 'DEBUG_TRIGGER_TIMEOUT'
  | 'DEBUG_PASSAGES'
  | 'DEBUG_EVAL'
  | 'DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES'
  | 'DEBUG_ASSERTIONS_ENTER_LOG_MESSAGES'
  | 'DEBUG_SELECTOR_ENTER_LOG_MESSAGES'
  | 'DEBUG_HAS_VISITED'
  | 'DEBUG_THIS_AS_PROMISE';

export const getLogger = (categoryName: Category = 'DEFAULT'): Logger => {
  if (getEnvLevelValue('DEFAULT') === undefined) {
    throw new Error(
      `Logger Configuration Error: Environment Variable '${getEnvLevelKey(
        'DEFAULT'
      )}' does not exist.`
    );
  }

  if (container.has(categoryName)) {
    return container.get(categoryName);
  } else {
    const configuredLevel = getEnvLevelValue(categoryName);
    if (configuredLevel === undefined) {
      getLogger('DEFAULT').warn(
        `Environment Variable '${getEnvLevelKey(
          categoryName
        )}' does not exist. Defaulting to 'debug'.`
      );
    }

    return container.add(categoryName, {
      level: configuredLevel ?? 'debug',
      format: format.simple(),
      transports: new transports.Console(),
      exceptionHandlers: new transports.Console(),
      rejectionHandlers: new transports.Console(),
      exitOnError: false,
    });
  }
};

const getEnvLevelKey = (categoryName: Category): string => {
  return `logger.${categoryName}.level`;
};

const getEnvLevelValue = (categoryName: Category): string | undefined => {
  return process.env[getEnvLevelKey(categoryName)];
};
