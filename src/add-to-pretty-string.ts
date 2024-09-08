import synchronizedPrettier from '@prettier/sync';
import { getLogger } from './logging/logger';

declare global {
  interface PrettyStringOptions {
    includeHeadElement: boolean;
    includeSvgBody: boolean;
    selectorsToRemove: string[];
  }

  interface Document {
    toPrettyString: (options?: Partial<PrettyStringOptions>) => string;
    printError: () => void;
  }
}

const logger = getLogger('DEFAULT');

export const addToPrettyString = (
  d: Document,
  printOnErrorOptions?: PrettyStringOptions
): void => {
  d.toPrettyString = toPrettyString;

  if (printOnErrorOptions !== undefined) {
    d.printError = () => printError(d, printOnErrorOptions);
  } else {
    d.printError = () => {}; /* noop */
  }
};

export function toPrettyString(
  this: Document,
  {
    includeHeadElement = true,
    includeSvgBody = true,
    selectorsToRemove = [],
  }: Partial<PrettyStringOptions> = {} /* Does not need to hardcode each option to true */
): string {
  const docEl = document.documentElement.cloneNode(true) as HTMLElement;

  if (!includeHeadElement) {
    docEl.querySelector('head').innerHTML =
      '<!-- Child elements removed by toPrettyString() -->';
  }
  if (!includeSvgBody) {
    docEl.querySelectorAll('svg').forEach((svg) => {
      svg.innerHTML = '<!-- Child elements removed by toPrettyString() -->';
    });
  }
  if (selectorsToRemove && selectorsToRemove.length > 0) {
    selectorsToRemove.forEach((selector) => {
      docEl.querySelectorAll(selector).forEach((el: HTMLElement) => {
        el.outerHTML = `<!-- '${selector}' removed by toPrettyString() -->`;
      });
    });
  }

  return synchronizedPrettier.format(docEl.outerHTML, {
    parser: 'html',
  });
}

export const printError = (
  document: Document,
  printOnErrorOptions: PrettyStringOptions
) : void => {
  logger.error(document.toPrettyString(printOnErrorOptions));
}
