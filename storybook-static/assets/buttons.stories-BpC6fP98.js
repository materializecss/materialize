const Y={title:"Components/Buttons"},m={Small:["btn-small"],"Small disabled":["btn-small","disabled"],Normal:[],"Normal disabled":["disabled"],Large:["btn-large"],"Large disabled":["btn-large","disabled"]},f={Default:[],Filled:["filled"],Tonal:["tonal"],Outlined:["outlined"],Text:["text"]},a={render(s){const g=document.createElement("table"),u=g.insertRow();u.insertCell();for(const n in m){const i=u.insertCell();i.innerText=n}for(const n in f){const i=g.insertRow(),q=i.insertCell();q.innerText=n;for(const O in m){const W=i.insertCell(),l=[...f[n],...m[O],...s.classes??[]],Z=l.includes("disabled")?'disabled="disabled"':"";let e="";s.icon?e=`<i class="material-icons">${s.icon}</i>`:s.iconLeft?(l.push("icon-left"),e=`<i class="material-icons">${s.iconLeft}</i>`):s.iconRight&&(l.push("icon-right"),e=`<i class="material-icons">${s.iconRight}</i>`),W.innerHTML=`
          <button ${Z} class="${l.join(" ")}">
            ${s.label}${e}
          </button>
        `}}return g},args:{label:"Button",classes:["btn"]}},t={...a,args:{label:"Button",classes:["btn","elevated"]}},c={...a,args:{label:"B",classes:["btn-floating"]}},o={...a,args:{label:"",icon:"edit",classes:["btn-floating"]}},r={...a,args:{label:"Button",iconLeft:"cloud",classes:["btn"]}},d={...a,args:{label:"Submit",iconRight:"send",classes:["btn"]}},b={render(){return`
<div class="fixed-action-btn">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn horizontal">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn click-to-toggle">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>
    `}};var h,p,_;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render(args) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.insertCell();
    for (const size in BTN_SIZES) {
      const cell = headerRow.insertCell();
      cell.innerText = size;
    }
    for (const btnStype in BTN_STYLES) {
      const row = table.insertRow();
      const cell = row.insertCell();
      cell.innerText = btnStype;
      for (const size in BTN_SIZES) {
        const cell = row.insertCell();
        const classes = [...BTN_STYLES[btnStype], ...BTN_SIZES[size], ...(args.classes ?? [])];
        const disabled = classes.includes('disabled') ? 'disabled="disabled"' : '';
        let iconHtml = '';
        if (args.icon) {
          iconHtml = \`<i class="material-icons">\${args.icon}</i>\`;
        } else if (args.iconLeft) {
          classes.push('icon-left');
          iconHtml = \`<i class="material-icons">\${args.iconLeft}</i>\`;
        } else if (args.iconRight) {
          classes.push('icon-right');
          iconHtml = \`<i class="material-icons">\${args.iconRight}</i>\`;
        }
        // TODO - why is anchor tag used in docs rather than button tag?
        cell.innerHTML = \`
          <button \${disabled} class="\${classes.join(' ')}">
            \${args.label}\${iconHtml}
          </button>
        \`;
      }
    }
    return table;
  },
  args: {
    label: 'Button',
    classes: ['btn']
  }
}`,...(_=(p=a.parameters)==null?void 0:p.docs)==null?void 0:_.source}}};var S,B,T;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  ...Basic,
  args: {
    label: 'Button',
    classes: ['btn', 'elevated']
  }
}`,...(T=(B=t.parameters)==null?void 0:B.docs)==null?void 0:T.source}}};var w,v,x;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  ...Basic,
  args: {
    label: 'B',
    classes: ['btn-floating']
  }
}`,...(x=(v=c.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var R,L,$;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:`{
  ...Basic,
  args: {
    label: '',
    icon: 'edit',
    classes: ['btn-floating']
  }
}`,...($=(L=o.parameters)==null?void 0:L.docs)==null?void 0:$.source}}};var E,y,I;r.parameters={...r.parameters,docs:{...(E=r.parameters)==null?void 0:E.docs,source:{originalSource:`{
  ...Basic,
  args: {
    label: 'Button',
    iconLeft: 'cloud',
    classes: ['btn']
  }
}`,...(I=(y=r.parameters)==null?void 0:y.docs)==null?void 0:I.source}}};var C,N,k;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  ...Basic,
  args: {
    label: 'Submit',
    iconRight: 'send',
    classes: ['btn']
  }
}`,...(k=(N=d.parameters)==null?void 0:N.docs)==null?void 0:k.source}}};var z,H,F;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render() {
    return \`
<div class="fixed-action-btn">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn horizontal">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn click-to-toggle">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>
    \`;
  }
}`,...(F=(H=b.parameters)==null?void 0:H.docs)==null?void 0:F.source}}};const j=["Basic","Elevated","FloatingWithText","FloatingWithIcon","IconLeft","IconRight","FloatingActionButton"];export{a as Basic,t as Elevated,b as FloatingActionButton,o as FloatingWithIcon,c as FloatingWithText,r as IconLeft,d as IconRight,j as __namedExportsOrder,Y as default};
