import { Text } from '../../components/atomic/atomic.mjs';
import { Component } from '../../components/atomic/component.mjs';
import { Container, Page } from '../../components/atomic/page.mjs';
import { Button } from '../../components/button/button.mjs';
import { AssistChip } from '../../components/chip/chip.mjs';

// class Link extends Component {
//   constructor(options) {
//     super(options);
//     this.setTagName('a');
//     //this.setAttribute('href', options.href);
//   }
// }

class BlogArticle extends Component {
  constructor(options) {
    super(options);
    this.setTagName('article');
    this.addClassname('card').addClassname('p-5');
  }
}

const myArticle = new BlogArticle(`
<p>01/01/2026 posted by Daniel</p>
<h1 class="m-0">Crafting Sleek, Responsive Interfaces with MaterializeWeb</h1>
<p class="flow-text" style="font-size: 1.15rem;">In the fast-evolving landscape of web development, building clean, responsive, and intuitive user interfaces remains a top priority. While major CSS frameworks like Bootstrap have long dominated the scene, <strong>MaterializeWeb</strong>—the community-driven evolution of MaterializeCSS—offers a refreshing design philosophy anchored directly in Google’s Material Design principles.</p>
<h2>What is MaterializeWeb?</h2>
<p>MaterializeWeb is an open-source, responsive front-end framework designed to streamline frontend development. Inspired by physical tactile materials like paper and ink, Materialize translates real-world physics into digital interfaces. It packages complex design concepts into ready-to-use HTML, CSS, and JavaScript components, allowing developers to create consistent, polished web applications with minimal overhead.</p>
<h2>Key Features and Benefits</h2>
<ul class="browser-default">
<li><strong>Material Design Aesthetic:</strong> Out of the box, MaterializeWeb provides realistic shadow depths, smooth motion transitions, and responsive ripple effects that make UI elements feel interactive and tactile.</li>
<li><strong>Community-Driven Continuity:</strong> Originally created as MaterializeCSS, the framework was actively adapted and maintained as MaterializeWeb by an open-source developer community, ensuring modern web standard compliance, security updates, and active bug fixes.</li>
<li><strong>Flexible Grid &amp; Utilities:</strong> Featuring a robust CSS grid system, flexbox support, and utility classes for typography, color palettes, and spacing, setting up complex responsive layouts takes minutes rather than hours.</li>
<li><strong>Rich Component Suite:</strong> Developers get access to pre-styled components, including floating action buttons (FABs), navigation bars, dynamic modals, toast notifications, cards, and interactive carousels.</li>
</ul>
<h2>Why Choose It for Your Next Project?</h2>
<p>If you want your web applications to mirror the sleek, unified visual identity of modern mobile apps without spending weeks writing custom styles, MaterializeWeb is an outstanding choice. It strikes an ideal balance between aesthetic polish and developer efficiency, making it perfect for rapid prototyping and production-ready sites alike.</p>
<p>Give MaterializeWeb a try on your next project to experience how effortless modern visual design can be!</p>`);

const blogPage = new Page({
  title: 'Materialize Web Blog',
  description: 'This is a custom blog',
  keywords: 'News sites, personal journals, niche resource hubs, and content creators.',
  children: [
    new Container({
      children: new Text('Materialize Web Blog').setTagName('p').addClassname('py-3')
    }),
    new Container({
      children: [
        new AssistChip({ href: './landingpage.html', name: 'Visit Landingpage' }),
        new AssistChip({ href: './portfolio.html', name: 'Visit Porfolio' })
      ]
    })
      .addClassname('g-2')
      .addClassname('row'),

    // TODO: use Breadcrumb Component
    new Container({
      children: 'Home > Articles > Crafting Sleek, Responsive Interfaces with MaterializeWeb'
    }).addClassname('py-5'),

    myArticle,
    new Container({
      children:
        '2 or 3-column masonry grid showing article thumbnails, titles, and publication dates'
    }).addClassname('py-5'),
    new Button({ children: 'Call to action' }),
    new Text(
      `This is a test <a href="./landingpage.html">Landingpage</a>. ok it can produce nested html too...<br>
      Or you can go to the <a href="./portfolio.html">Portfolio</a>`
    ),
    new Container({
      children: 'Sidebar or navigation dropdowns ("Tech," "Lifestyle")'
    }).addClassname('py-5')
  ]
}).addStyleUrl('/dist/css/materialize.css')
  .addStyle(`article { font-family: Times; line-height: 1.25; }
    h1 { font-size: 2.75em; }
    h2 { font-size: 2em; }
    h3 { font-size: 1.5em; }
    p, li { font-size: 1.2em;  }
    `);

const html = blogPage.toHTML();
console.log(html);
