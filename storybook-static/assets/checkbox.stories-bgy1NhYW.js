const o={title:"Components/Checkbox"},e={render(){return`
<form action="#">
  <p>
    <label>
      <input type="checkbox" />
      <span>Unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" />
      <span>Checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" disabled="disabled" />
      <span>Disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" disabled="disabled" />
      <span>Checked & Disabled</span>
    </label>
  </p>
</form>
    `}},n={render(){return`
<form action="#">
  <p>
    <label>
      <input type="checkbox" class="filled-in"/>
      <span>Filled in unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked"/>
      <span>Filled in checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" disabled="disabled"/>
      <span>Filled in disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked" disabled="disabled"/>
      <span>Filled in checked & disabled</span>
    </label>
  </p>
</form>
    `}},l={render(){return`
<form action="#">
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" />
      <span>Indeterminate Style</span>
    </label>
  </p>
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" disabled="disabled"/>
      <span>Indeterminate Disabled</span>
    </label>
  </p>
</form>

<script>
  // Set the indeterminate property on the checkbox elements
  const elements = document.querySelectorAll('.indeterminate-checkbox');
  elements.forEach((element) => {
    element.indeterminate = true;
  });
<\/script>
    `}};var a,c,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render() {
    return \`
<form action="#">
  <p>
    <label>
      <input type="checkbox" />
      <span>Unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" />
      <span>Checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" disabled="disabled" />
      <span>Disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" checked="checked" disabled="disabled" />
      <span>Checked & Disabled</span>
    </label>
  </p>
</form>
    \`;
  }
}`,...(s=(c=e.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};var t,p,d;n.parameters={...n.parameters,docs:{...(t=n.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render() {
    return \`
<form action="#">
  <p>
    <label>
      <input type="checkbox" class="filled-in"/>
      <span>Filled in unchecked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked"/>
      <span>Filled in checked</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" disabled="disabled"/>
      <span>Filled in disabled</span>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" class="filled-in" checked="checked" disabled="disabled"/>
      <span>Filled in checked & disabled</span>
    </label>
  </p>
</form>
    \`;
  }
}`,...(d=(p=n.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var i,r,b;l.parameters={...l.parameters,docs:{...(i=l.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render() {
    return \`
<form action="#">
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" />
      <span>Indeterminate Style</span>
    </label>
  </p>
  <p>
    <label>
      <input class="indeterminate-checkbox" type="checkbox" disabled="disabled"/>
      <span>Indeterminate Disabled</span>
    </label>
  </p>
</form>

<script>
  // Set the indeterminate property on the checkbox elements
  const elements = document.querySelectorAll('.indeterminate-checkbox');
  elements.forEach((element) => {
    element.indeterminate = true;
  });
<\/script>
    \`;
  }
}`,...(b=(r=l.parameters)==null?void 0:r.docs)==null?void 0:b.source}}};const h=["Default","FilledIn","Indeterminate"],k=Object.freeze(Object.defineProperty({__proto__:null,Default:e,FilledIn:n,Indeterminate:l,__namedExportsOrder:h,default:o},Symbol.toStringTag,{value:"Module"}));export{e as D,n as F,l as I,k as s};
