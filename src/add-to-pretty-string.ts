import synchronizedPrettier from '@prettier/sync';

declare global {
  interface PrettyStringOptions {
    includeHeadElement: boolean;
    includeSvgBody: boolean;
    selectorsToRemove: string[];
  }

  interface Document {
    toPrettyString: (options?: Partial<PrettyStringOptions>) => string;
  }
}

export const addToPrettyString = (d: Document): void => {
  d.toPrettyString = function (
    this: Document,
    {
      includeHeadElement = true,
      includeSvgBody = true,
      selectorsToRemove = [],
    }: Partial<PrettyStringOptions> = {} /* Does not need to hardcode each option to true */
  ): string {
    let docEl = document.documentElement.cloneNode(true) as HTMLElement;

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
  };
};
