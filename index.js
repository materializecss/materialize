const { Button, Grid } = require('@materializecss/materialize');

// This is experimental

const html = Grid(['<p>Are you cool?</p>', Button('Yes'), Button('No')].join(''));
console.log(html);
