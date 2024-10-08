export const setupHTMLDialogElement = (window) => {
  const prototype = window.HTMLDialogElement.prototype;

  prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute(`open`, `open`);
    this.style.display = 'block';
  };
  prototype.show = prototype.showModal;
  prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute(`open`);
    this.style.display = 'none';

    const event = new globalThis.window.Event(`close`);
    this.dispatchEvent(event);
  };

  prototype['isSetupDialogElement'] = true;
};
