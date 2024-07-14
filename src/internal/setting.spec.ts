import { SugarcubeParser } from '../sugarcube-parser';

describe(`Settings`, () => {
  it('can use settings in subsequent SugarcubeParser.create calls', async () => {
    const passages = [
      {
        title: 'passage title',
        tags: ['passage tag'],
        text: 'abc',
      },
      {
        title: 'Script',
        tags: ['script'],
        text: `
    Setting.addToggle('my-toggle-name', {
      label: 'My Toggle',
      default: true,
      onChange: () => {},
      onInit: () => {},
    });
          `,
      },
    ];

    await SugarcubeParser.create({
      passages,
    });

    const sugarcubeParser = await SugarcubeParser.create({
      passages,
    });

    await sugarcubeParser.testController.goto('passage title');
  });
});
