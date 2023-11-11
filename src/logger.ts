import {
  Container,
  Logger,
  format,
  transports,
  createLogger,
  LeveledLogMethod,
} from 'winston';

const container = new Container();

export type Category =
  | 'DEFAULT'
  | 'DEBUG_TRIGGER_TIMEOUT'
  | 'DEBUG_PASSAGES'
  | 'DEBUG_TEST_CONTROLLER_ENTER_LOG_MESSAGES'
  | 'DEBUG_ASSERTIONS_ENTER_LOG_MESSAGES'
  | 'DEBUG_SELECTOR_ENTER_LOG_MESSAGES'
  | 'DEBUG_HAS_VISITED'
  | 'DEBUG_THIS_AS_PROMISE';

export const getLogger = (categoryName: Category = 'DEFAULT'): Logger => {
  if (container.has(categoryName)) {
    return container.get(categoryName);
  } else {
    const impl = container.add(categoryName, {
      level: categoryEnvVariable(categoryName) || 'debug',
      format: format.simple(),
      transports: new transports.Console(),
      exceptionHandlers: new transports.Console(),
      rejectionHandlers: new transports.Console(),
      exitOnError: false,
    });
    validateEnvironmentBeforeCall(categoryName, impl, 'debug');
    validateEnvironmentBeforeCall(categoryName, impl, 'info');
    validateEnvironmentBeforeCall(categoryName, impl, 'warn');
    validateEnvironmentBeforeCall(categoryName, impl, 'error');
    return impl;
  }
};

const categoryEnvVariable = (categoryName?: Category): string | undefined => {
  return (
    process.env[`logger.${categoryName}.level`] ||
    process.env[`logger.${categoryName.toLowerCase()}.level`] ||
    process.env[`logger.${categoryName.toUpperCase()}.level`]
  );
};

function validateEnvironmentBeforeCall<
  Prop extends {
    [P in keyof Logger]: Logger[P] extends LeveledLogMethod ? P : never;
  }[keyof Logger],
>(categoryName: Category, logger: Logger, logFunction: Prop): void {
  const fn = logger[logFunction];
  const boundFn = fn.bind(logger);
  logger[logFunction] = (...params: unknown[]) => {
    validateEnvironmentVariables(categoryName);
    boundFn(...params);
  };
}

const validateEnvironmentVariables = (categoryName: Category) => {
  if (categoryEnvVariable('DEFAULT') === undefined) {
    throw new Error(
      `Environment Variable 'logger.DEFAULT.level' does not exist.`
    );
  }

  const configuredLevel = categoryEnvVariable(categoryName);
  if (configuredLevel === undefined) {
    getLogger('DEFAULT').warn(
      `Environment Variable 'logger.${categoryName}.level' does not exist.`
    );
  }
};
