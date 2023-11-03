<!doctype html>
<html data-init="no-js">
  <head>
    <meta charset="UTF-8" />
    <title>Story Name</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <script id="script-libraries" type="text/javascript">
      if (
        document.head &&
        document.addEventListener &&
        document.querySelector &&
        Object.create &&
        Object.freeze &&
        JSON
      ) {
        document.documentElement.setAttribute('data-init', 'loading');
      } else {
        document.documentElement.setAttribute('data-init', 'lacking');
      }
    </script>
  </head>
  <body>
    <div id="init-screen">
      <div id="init-no-js">
        <noscript>JavaScript must be enabled to play.</noscript>
      </div>
      <div id="init-lacking">
        <p>Browser lacks capabilities required to play.</p>
        <p>Upgrade or switch to another browser.</p>
      </div>
      <div id="init-loading"><div>Loading&hellip;</div></div>
    </div>
    <script id="script-sugarcube" type="text/javascript">
      if (document.documentElement.getAttribute('data-init') === 'loading') {
      }
    </script>
  </body>
</html>
