const l={title:"Components/RadioButtons"},e={render(){return`
<form action="#">
  <p>
    <label>
      <input name="group1" type="radio" checked />
      <span>Red</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" />
      <span>Yellow</span>
    </label>
  </p>
  <p>
    <label>
      <input class="with-gap" name="group1" type="radio"  />
      <span>Green</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" disabled="disabled" />
      <span>Brown</span>
    </label>
  </p>
</form>
    `}},n={render(){return`
<p>
  <label>
    <input class="with-gap" name="group3" type="radio" checked />
    <span>Red</span>
  </label>
</p>
    `}};var a,p,r;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render() {
    return \`
<form action="#">
  <p>
    <label>
      <input name="group1" type="radio" checked />
      <span>Red</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" />
      <span>Yellow</span>
    </label>
  </p>
  <p>
    <label>
      <input class="with-gap" name="group1" type="radio"  />
      <span>Green</span>
    </label>
  </p>
  <p>
    <label>
      <input name="group1" type="radio" disabled="disabled" />
      <span>Brown</span>
    </label>
  </p>
</form>
    \`;
  }
}`,...(r=(p=e.parameters)==null?void 0:p.docs)==null?void 0:r.source}}};var s,o,t;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render() {
    return \`
<p>
  <label>
    <input class="with-gap" name="group3" type="radio" checked />
    <span>Red</span>
  </label>
</p>
    \`;
  }
}`,...(t=(o=n.parameters)==null?void 0:o.docs)==null?void 0:t.source}}};const d=["Default","WithGap"],i=Object.freeze(Object.defineProperty({__proto__:null,Default:e,WithGap:n,__namedExportsOrder:d,default:l},Symbol.toStringTag,{value:"Module"}));export{e as D,n as W,i as s};
