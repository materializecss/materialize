import { Text } from '../../components/atomic/atomic.mjs';
import { Component } from '../../components/atomic/component.mjs';
import { Container, Page } from '../../components/atomic/page.mjs';
import { Button } from '../../components/button/button.mjs';

class Link extends Component {
  constructor(options) {
    super(options);
    this.setTagName('a');
    //this.setAttribute('href', options.href);
  }
}

const blogPage = new Page({
  title: 'My Blog',
  description: 'This is a custom blog',
  keywords: 'News sites, personal journals, niche resource hubs, and content creators.',
  children: [
    new Container({ children: new Text('Blog').setTagName('h1') }),
    new Container({ children: 'This is a featured Post' }).addClassname('py-5'),
    new Container({
      children:
        '2 or 3-column masonry grid showing article thumbnails, titles, and publication dates'
    }).addClassname('py-5'),
    new Button({ children: 'Call to action' }),
    new Link({ href: '.landingpage.html' }),
    new Text(
      `This is a test <a href="./landingpage.html">Landingpage</a>. ok it can produce nested html too...<br>
      Or you can go to the <a href="./portfolio.html">Portfolio</a>`
    ),
    new Container({
      children: 'Sidebar or navigation dropdowns ("Tech," "Lifestyle")'
    }).addClassname('py-5')
  ]
}).addStyleUrl(
  'https://cdn.jsdelivr.net/npm/@materializecss/materialize@latest/dist/css/materialize.min.css'
);

const html = blogPage.toHTML();
console.log(html);
