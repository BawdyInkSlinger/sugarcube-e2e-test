import { JSDOM } from 'jsdom';

describe(`jsdom`, () => {
  it(`has window.requestAnimationFrame when pretendToBeVisual is true`, async () => {
    const { window } = new JSDOM('', {
      pretendToBeVisual: true,
    });

    expect(window.requestAnimationFrame).not.toBeUndefined();
  });

  it('does not have window.requestAnimationFrame when pretendToBeVisual is false', async () => {
    const { window } = new JSDOM('', {
      pretendToBeVisual: false,
    });

    window.eval(`requestAnimationFrame`);
    expect(window.requestAnimationFrame).toBeUndefined();
  });
});
