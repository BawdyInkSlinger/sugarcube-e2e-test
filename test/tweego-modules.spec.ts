import { SugarcubeParser, Selector } from '../src';

const passageText = `
<<script>>
    console.log(window.NodeList);
    const easing = 'easeOutQuart';
    anime({
        targets: "p",
        width: '100%',
        easing: easing,
        duration: 1000,
    });
<</script>>
<p>p1</p>
<p>p2</p>
`

describe('Tweego Modules', () => {
  fit('can load and use anime.js when targets match multiple elements', async () => {
    const sugarcubeParser = await SugarcubeParser.create({
      passages: [
        {
          title: 'TweegoModules title',
          tags: ['TweegoModules tag'],
          text: passageText,
        },
      ],
    });

    await sugarcubeParser.testController
      .goto('TweegoModules title')
      .expect(Selector(`.passage`).exists)
      .ok();
  });
});
