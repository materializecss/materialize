import { Text } from '../../components/atomic/atomic.mjs';
import { Container, Page } from '../../components/atomic/page.mjs';

const landingPage = new Page({
  title: 'My Landingpage',
  description: 'Introducing the new Phone',
  keywords: 'App launches, SaaS companies, small service businesses, and single-product e-commerce',
  children: [
    new Container({ children: new Text('Landing Page').setTagName('h1') }),
    new Container(`<img src="https://picsum.photos/id/1/900/600"/>`),
    new Container({
      children: 'Hero Section',
      description: `A bold "Hero" section at the top with a clear headline, followed by social proof (reviews/logos),' +
        'feature blocks, and multiple Calls- to - Action(CTAs) like "Sign Up" or "Buy Now.".
        You can also checkout the <a href="./blog.html">Blog</a>`
    }),
    new Container(`A bold "Hero" section at the top with a clear headline, followed by social proof (reviews/logos),<br>
      feature blocks, and multiple Calls- to - Action(CTAs) like "Sign Up" or "Buy Now.<br>
      You can also checkout the <a href="./blog.html">Blog</a>`),
    new Container('Hello, this is my landing page!').addClassname('pt-5')
  ]
}).addStyleUrl(
  'https://cdn.jsdelivr.net/npm/@materializecss/materialize@latest/dist/css/materialize.min.css'
);

const html = landingPage.toHTML();
console.log(html);
