# Testcafe Reference

## withExactText

Given this HTML:

```html
<div id="whitespace">
  foobar
</div>
<div id="nested-one-child"><span>foobar</span></div>
<div id="deeply-nested-one-child"><div><span>foobar</span></div></div>
<div id="nested-two-child"><div><span>foo</span><span>bar</span></div></div>
<div id="deeply-nested-one-child-with-whitespace">
  <div>
    <span>foobar</span>
  </div>
</div>
<div id="nested-two-child-with-whitespace">
  <div>
    <span>foo</span>
    <span>bar</span>
  </div>
</div>
```

This is how `withExactText` responds:

```JavaScript
console.log(`As one word: `);
console.log(`#whitespace`, await Selector(`#whitespace`).withExactText(`foobar`).exists); // true
console.log(`#nested-one-child`, await Selector(`#nested-one-child`).withExactText(`foobar`).exists); // true
console.log(`#deeply-nested-one-child`, await Selector(`#deeply-nested-one-child`).withExactText(`foobar`).exists); // true
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withExactText(`foobar`).exists); // true
console.log(`#deeply-nested-one-child-with-whitespace`, await Selector(`#deeply-nested-one-child-with-whitespace`).withExactText(`foobar`).exists); // true
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withExactText(`foobar`).exists); // false
console.log();
console.log(`Space at end:`);
console.log(`#whitespace`, await Selector(`#whitespace`).withExactText(`foobar `).exists); // false
console.log(`#nested-one-child`, await Selector(`#nested-one-child`).withExactText(`foobar `).exists); // false
console.log(`#deeply-nested-one-child`, await Selector(`#deeply-nested-one-child`).withExactText(`foobar `).exists); // false
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withExactText(`foobar `).exists); // false
console.log(`#deeply-nested-one-child-with-white-space`, await Selector(`#deeply-nested-one-child-with-white-space`).withExactText(`foobar `).exists); // false
console.log(`#nested-two-child-with-white-space`, await Selector(`#nested-two-child-with-white-space`).withExactText(`foobar `).exists); // false
console.log();
console.log(`On one of two children:`);
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withExactText(`foo`).exists); // false
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withExactText(`foo`).exists); // false
console.log();
console.log(`Substring across two children:`);
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withExactText(`ooba`).exists); // false
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withExactText(`ooba`).exists); // false
```

## withText

Given this HTML:

```html
<div id="whitespace">
  foobar
</div>
<div id="nested-one-child"><span>foobar</span></div>
<div id="deeply-nested-one-child"><div><span>foobar</span></div></div>
<div id="nested-two-child"><div><span>foo</span><span>bar</span></div></div>
<div id="deeply-nested-one-child-with-whitespace">
  <div>
    <span>foobar</span>
  </div>
</div>
<div id="nested-two-child-with-whitespace">
  <div>
    <span>foo</span>
    <span>bar</span>
  </div>
</div>
```

This is how `withText` responds:

```JavaScript
console.log(`As one word: `);
console.log(`#whitespace`, await Selector(`#whitespace`).withText(`foobar`).exists); // true
console.log(`#nested-one-child`, await Selector(`#nested-one-child`).withText(`foobar`).exists); // true
console.log(`#deeply-nested-one-child`, await Selector(`#deeply-nested-one-child`).withText(`foobar`).exists); // true
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withText(`foobar`).exists); // true
console.log(`#deeply-nested-one-child-with-whitespace`, await Selector(`#deeply-nested-one-child-with-whitespace`).withText(`foobar`).exists); // true
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withText(`foobar`).exists); // false
console.log();
console.log(`Space at end:`);
console.log(`#whitespace`, await Selector(`#whitespace`).withText(`foobar `).exists); // false
console.log(`#nested-one-child`, await Selector(`#nested-one-child`).withText(`foobar `).exists); // false
console.log(`#deeply-nested-one-child`, await Selector(`#deeply-nested-one-child`).withText(`foobar `).exists); // false
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withText(`foobar `).exists); // false
console.log(`#deeply-nested-one-child-with-white-space`, await Selector(`#deeply-nested-one-child-with-white-space`).withText(`foobar `).exists); // false
console.log(`#nested-two-child-with-white-space`, await Selector(`#nested-two-child-with-white-space`).withText(`foobar `).exists); // false
console.log();
console.log(`On one of two children:`);
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withText(`foo`).exists); // true
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withText(`foo`).exists); // true
console.log();
console.log(`Substring across two children:`);
console.log(`#nested-two-child`, await Selector(`#nested-two-child`).withText(`ooba`).exists); // true
console.log(`#nested-two-child-with-whitespace`, await Selector(`#nested-two-child-with-whitespace`).withText(`ooba`).exists); // false
```
