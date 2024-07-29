import './../src/test-api/internal/monkey-patching/jsdom/strings';
import { JSDOM } from 'jsdom';

describe(`jsdom`, () => {
  describe(`requestAnimationFrame`, () => {
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

      expect(window.requestAnimationFrame).toBeUndefined();
    });
  });

  describe(`getStyleProperty`, () => {
    it(`can compute default property values`, async () => {
      const { window } = new JSDOM('<p>Hello!</p>', {
        pretendToBeVisual: true,
      });

      expect(
        window.getComputedStyle(window.document.querySelector(`p`)!)['display']
      ).toEqual('block');
    });

    it(`can compute inline property styles`, async () => {
      const { window } = new JSDOM('<p style="display: none">Hello!</p>', {
        pretendToBeVisual: true,
      });

      expect(
        window.getComputedStyle(window.document.querySelector(`p`)!)['display']
      ).toEqual('none');
    });

    it(`can compute head element styles`, async () => {
      const { window } = new JSDOM(
        `
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
    <style>
        p {
            display: none;
        }
    </style>
</head>
<body>
    <p>Hello!</p>
</body>
</html>
        `,
        {
          pretendToBeVisual: true,
        }
      );

      expect(
        window.getComputedStyle(window.document.querySelector(`p`)!)['display']
      ).toEqual('none');
    });

    it(`can compute styles from CSS class`, async () => {
      const { window } = new JSDOM(
        `
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
    <style>
        .my-prop {
            display: none;
        }
    </style>
</head>
<body>
    <p class="my-prop">Hello!</p>
</body>
</html>
        `,
        {
          pretendToBeVisual: true,
        }
      );

      expect(
        window.getComputedStyle(window.document.querySelector(`p`)!)['display']
      ).toEqual('none');
    });
  });
});
