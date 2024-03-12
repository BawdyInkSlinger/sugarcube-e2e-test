import { parse } from 'stacktrace-parser';
import { format } from 'winston';
import { basename } from 'node:path';

export const logPrefix = format((info, opts) => {
  const stackFrames = parse(new Error().stack);
  const logFrameIndex =
    stackFrames.findIndex((stackFrame) => {
      return stackFrame.file.endsWith(`create-logger.js`);
    }) + 1;

  if (logFrameIndex === 0) {
    info.message = `unknown: ${info.message}`;
  } else {
    const logFrame = stackFrames[logFrameIndex];
    // console.log(`\n`, logFrame);
    let prefix = new Date().toISOString();
    prefix += ' ' + basename(logFrame.file);
    // if (logFrame.methodName !== `<unknown>`) {
    //   prefix += `@${logFrame.methodName}`;
    // }
    prefix += `#${logFrame.lineNumber}`;
    info.message = `${prefix}: ${info.message}`;
  }

  return info;
});
