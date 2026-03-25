import { Component } from '../component.mjs';

/*
<ul class="tabs">
  <li class="tab"><a href="#test1">Test 1</a></li>
  <li class="tab"><a class="active" href="#test2">Test 2</a></li>
  <li class="tab disabled"><a href="#test3">Disabled Tab</a></li>
  <li class="tab"><a href="#test4">Test 4</a></li>
</ul>

<div id="test1">Test 1</div>
<div id="test2">Test 2</div>
<div id="test3">Test 3</div>
<div id="test4">Test 4</div>
*/

class Tabs extends Component {
  #tabs = [];

  constructor(options) {
    super(options);
    this.setTagName('ul');
    this.addClassname('tabs');
  }

  getBodyHtml() {}
}

// TODO: TabHeader and TabBody

export { Tabs };
