import { parse } from 'stacktrace-parser';
import { format, config } from 'winston';
import { TransformFunction } from 'logform';
import { basename } from 'node:path';

const levelToNumber = config.npm.levels;

const transform: TransformFunction = (info, opts) => {
  if (opts?.loggerLevel !== undefined) {
    if (levelToNumber[opts?.loggerLevel] < levelToNumber[info.level]) {
      return false;
    }
  }

  const stack = new Error().stack;
  const stackFrames = parse(stack);
  const logFrameIndex =
    stackFrames.findIndex((stackFrame) => {
      return stackFrame.file.endsWith(`create-logger.js`);
    }) + 1;

  if (logFrameIndex === 0) {
    info.message = `unknown: ${info.message}`;
  } else {
    const logFrame = stackFrames[logFrameIndex];
    let prefix = new Date().toISOString();
    prefix += ' ' + basename(logFrame.file);
    prefix += `#${logFrame.lineNumber}`;
    info.message = `${prefix}: ${info.message}`;
  }

  return info;
};

export const logPrefix = format(transform);
