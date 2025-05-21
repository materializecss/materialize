import type { Meta, StoryObj } from '@storybook/html';

export default {
  title: 'Components/Buttons',

} satisfies Meta;


const BTN_SIZES = {
  'Small': ['btn-small'],
  'Small disabled': ['btn-small', 'disabled'],
  'Normal': [],
  'Normal disabled': ['disabled'],
  'Large': ['btn-large'],
  'Large disabled': ['btn-large', 'disabled'],
};

const BTN_STYLES = {
  'Default': [],  // uncomment this to see the default button when no filled/tonal/outlined/text is set
  'Filled': ['filled'],
  'Tonal': ['tonal'],
  'Outlined': ['outlined'],
  'Text': ['text']
};


export const Basic: StoryObj = {
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
        const classes = [...BTN_STYLES[btnStype], ...BTN_SIZES[size], ...args.classes?? [] ];
        const disabled = classes.includes('disabled') ? 'disabled="disabled"' : '';
        let iconHtml = '';
        if (args.icon) {
          iconHtml = `<i class="material-icons">${args.icon}</i>`;
        } else if (args.iconLeft) {
          classes.push('icon-left');
          iconHtml = `<i class="material-icons">${args.iconLeft}</i>`;
        } else if (args.iconRight) {
          classes.push('icon-right');
          iconHtml = `<i class="material-icons">${args.iconRight}</i>`;
        }
        // TODO - why is anchor tag used in docs rather than button tag?
        cell.innerHTML = `
          <button ${disabled} class="${classes.join(' ')}">
            ${args.label}${iconHtml}
          </button>
        `;
      }
    }
    return table;
  },
  args: {
    label: 'Button',
    classes: ['btn']
  }
};

export const Elevated: StoryObj = {
  ...Basic,
  args: {
    label: 'Button',
    classes: ['btn', 'elevated']
  }
};

export const FloatingWithText: StoryObj = {
  ...Basic,
  args: {
    label: 'B',
    classes: ['btn-floating']
  }
};

export const FloatingWithIcon: StoryObj = {
  ...Basic,
  args: {
    label: '',
    icon: 'edit',
    classes: ['btn-floating']
  }
};

export const IconLeft: StoryObj = {
  ...Basic,
  args: {
    label: 'Button',
    iconLeft: 'cloud',
    classes: ['btn']
  }
};

export const IconRight: StoryObj = {
  ...Basic,
  args: {
    label: 'Submit',
    iconRight: 'send',
    classes: ['btn']

  }
};


export const FloatingActionButton: StoryObj = {
  render() {
    return `
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
    `;
  },
}
