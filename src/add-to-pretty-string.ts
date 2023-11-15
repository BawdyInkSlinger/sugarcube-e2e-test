import synchronizedPrettier from "@prettier/sync";

declare global {
  interface PrettyStringOptions {
    includeHeadElement: boolean;
  }

  interface Document {
    toPrettyString: (options?: PrettyStringOptions) => string;
  }
}

export const addToPrettyString = (d: Document): void => {
  d.toPrettyString = function (
    options: PrettyStringOptions = { includeHeadElement: true }
  ): string {
    let html = document.documentElement.outerHTML;

    if (!options.includeHeadElement) {
      const docEl: HTMLElement = document.documentElement.cloneNode(
        true
      ) as HTMLElement;
      docEl.querySelector('head').remove();
      html = docEl.outerHTML;
    }

    return synchronizedPrettier.format(html, {
      parser: 'html',
    });
  };

};
