import { Text } from '../../components/atomic/atomic.mjs';
import { Container, Page } from '../../components/atomic/page.mjs';

const landingPage = new Page({
  title: 'T-Shirt Landingpage',
  description: 'Introducing the new T-Shirt from Materialize',
  keywords: 'App launches, SaaS companies, small service businesses, and single-product e-commerce',
  children: [
    new Container({ children: new Text('a').setTagName('h1') }),
    //new Container(`<img src="https://picsum.photos/id/1/900/600"/>`),
    new Container({ children: 'T-Shirt', description: `Nothing to see here` }),
    //
    new Container(`A bold "Hero" section at the top with a clear headline, followed by social proof (reviews/logos),<br>
      feature blocks, and multiple Calls- to - Action(CTAs) like "Sign Up" or "Buy Now.<br>
      You can also checkout the <a href="./blog.html">Blog</a>
      klöxökkökökxl
      <hr/>

      <button
        id="dropdown-trigger-1"
        class="dropdown-trigger"
        data-target="my-dropdown"
        aria-expanded="false"
      >
        Options Menu ▾
      </button>

      <ul id="my-dropdown" class="dropdown-content">
        <li><a href="#profile">Profile</a></li>
        <li><a href="#settings">Settings</a></li>
        <li><a href="#help">Help & Support</a></li>
        <li tabindex="-1"><hr /></li>
        <li><button type="button">Sign Out</button></li>
      </ul>
      `),

    new Container('Hello, this is my landing page!').addClassname('pt-5')
  ]
});
// CSS
landingPage
  .addStyleUrl('/dist/css/materialize.css')
  .addStyleUrl('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
// Client JS
landingPage.addJavascriptUrl('/dist/js/materialize.js');
landingPage.addJavascript(`M.AutoInit();`);

const html = landingPage.toHTML();
console.log(html);
