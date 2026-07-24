import { Text } from '../../components/atomic/atomic.mjs';
import { Container, Page } from '../../components/atomic/page.mjs';
import { Grid } from '../../components/grid/grid.js';

const portfolioPage = new Page({
  title: 'My Portfolio',
  description: 'This is a custom gallery of my items',
  keywords: 'Gallery, Products, Stuff',
  children: [
    new Container({ children: new Text('My Portfolio').setTagName('h1') }),
    new Container(
      `Hello, this is my portfolio. You can also checkout the <a href="./blog.html">Blog</a>`
    ).addClassname('pb-5'),
    new Container({ children: 'Sidebar' }),
    new Grid({
      children: [
        `<img src="https://picsum.photos/id/23/300"/>`,
        `<img src="https://picsum.photos/id/44/300"/>`,
        `<img src="https://picsum.photos/id/66/300"/>`,
        `<img src="https://picsum.photos/id/77/300"/>`
      ]
    })
      .setColumns(2)
      .addClassname('py-5')
  ]
}).addStyleUrl('/dist/css/materialize.css');

const html = portfolioPage.toHTML();
console.log(html);
