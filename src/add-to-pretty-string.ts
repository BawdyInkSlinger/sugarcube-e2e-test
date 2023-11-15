import synchronizedPrettier from '@prettier/sync';

declare global {
  interface PrettyStringOptions {
    includeHeadElement: boolean;
    includeSvgBody: boolean;
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

    return synchronizedPrettier.format(docEl.outerHTML, {
      parser: 'html',
    });
  };
};
