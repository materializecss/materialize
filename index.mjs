import { Button, Grid, Modal } from '@materializecss/materialize';

// This is experimental

const html =
  Grid(['<p>Are you cool?</p>', Button('Yes'), Button('No')].join('')) + Modal.create('test');

const Page = (children) => {
  const c = Array.isArray(children) ? children.join('') : children;
  return `<html>
  <head></head>
  <body>
  ${c}
  </body>
</html>`;
};

const Text = (children) => {
  const c = Array.isArray(children) ? children.join('') : children;
  return `<p>${c}</p>\n`;
};

const page = Page([
  Text('This is the header'),
  Grid([Text('Are you cool?'), Button('Yes'), Button('No')]),
  Text('This is the footer')
]);

console.log(page.html);
