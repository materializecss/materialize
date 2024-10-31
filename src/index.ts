import { Autocomplete } from './autocomplete';
import { FloatingActionButton } from './buttons';
import { Cards } from './cards';
import { Carousel } from './carousel';
import { CharacterCounter } from './characterCounter';
import { Chips } from './chips';
import { Collapsible } from './collapsible';
import { Datepicker } from './datepicker';
import { Dropdown } from './dropdown';
import { Forms } from './forms';
import { Materialbox } from './materialbox';
import { Modal } from './modal';
import { Parallax } from './parallax';
import { Pushpin } from './pushpin';
import { ScrollSpy } from './scrollspy';
import { FormSelect } from './select';
import { Sidenav } from './sidenav';
import { Slider } from './slider';
import { Tabs } from './tabs';
import { TapTarget } from './tapTarget';
import { Timepicker } from './timepicker';
import { Toast, ToastOptions } from './toasts';
import { Tooltip } from './tooltip';
import { Waves } from './waves';
import { Range } from './range';
import { Utils } from './utils';
import { Component } from './component';

export { Autocomplete } from './autocomplete';
export { FloatingActionButton } from './buttons';
export { Cards } from './cards';
export { Carousel } from './carousel';
export { CharacterCounter } from './characterCounter';
export { Chips } from './chips';
export { Collapsible } from './collapsible';
export { Datepicker } from './datepicker';
export { Dropdown } from './dropdown';
export { Forms } from './forms';
export { Materialbox } from './materialbox';
export { Modal } from './modal';
export { Parallax } from './parallax';
export { Pushpin } from './pushpin';
export { ScrollSpy } from './scrollspy';
export { FormSelect } from './select';
export { Sidenav } from './sidenav';
export { Slider } from './slider';
export { Tabs } from './tabs';
export { TapTarget } from './tapTarget';
export { Timepicker } from './timepicker';
export { Toast } from './toasts';
export { Tooltip } from './tooltip';
export { Waves } from './waves';
export { Range } from './range';

export const version = '2.1.1';

export const Grid = (children: any = '') => {
  return `<div class="row">${children}</row>`;
};

export function Button(children: any = '') {
  return `<button class="btn">${children}</button>`;
}

/**
 * Automatically initialize components.
 * @param context Root element to initialize. Defaults to `document.body`.
 */
export function AutoInit(context: HTMLElement = document.body) {
  let registry = {
    Autocomplete: context.querySelectorAll('.autocomplete:not(.no-autoinit)'),
    Carousel: context.querySelectorAll('.carousel:not(.no-autoinit)'),
    Chips: context.querySelectorAll('.chips:not(.no-autoinit)'),
    Collapsible: context.querySelectorAll('.collapsible:not(.no-autoinit)'),
    Datepicker: context.querySelectorAll('.datepicker:not(.no-autoinit)'),
    Dropdown: context.querySelectorAll('.dropdown-trigger:not(.no-autoinit)'),
    Materialbox: context.querySelectorAll('.materialboxed:not(.no-autoinit)'),
    Modal: context.querySelectorAll('.modal:not(.no-autoinit)'),
    Parallax: context.querySelectorAll('.parallax:not(.no-autoinit)'),
    Pushpin: context.querySelectorAll('.pushpin:not(.no-autoinit)'),
    ScrollSpy: context.querySelectorAll('.scrollspy:not(.no-autoinit)'),
    FormSelect: context.querySelectorAll('select:not(.no-autoinit)'),
    Sidenav: context.querySelectorAll('.sidenav:not(.no-autoinit)'),
    Tabs: context.querySelectorAll('.tabs:not(.no-autoinit)'),
    TapTarget: context.querySelectorAll('.tap-target:not(.no-autoinit)'),
    Timepicker: context.querySelectorAll('.timepicker:not(.no-autoinit)'),
    Tooltip: context.querySelectorAll('.tooltipped:not(.no-autoinit)'),
    FloatingActionButton: context.querySelectorAll('.fixed-action-btn:not(.no-autoinit)')
  };
  Autocomplete.init(registry.Autocomplete, {});
  Carousel.init(registry.Carousel, {});
  Chips.init(registry.Chips, {});
  Collapsible.init(registry.Collapsible, {});
  Datepicker.init(registry.Datepicker, {});
  Dropdown.init(registry.Dropdown, {});
  Materialbox.init(registry.Materialbox, {});
  Modal.init(registry.Modal, {});
  Parallax.init(registry.Parallax, {});
  Pushpin.init(registry.Pushpin, {});
  ScrollSpy.init(registry.ScrollSpy, {});
  FormSelect.init(registry.FormSelect, {});
  Sidenav.init(registry.Sidenav, {});
  Tabs.init(registry.Tabs, {});
  TapTarget.init(registry.TapTarget, {});
  Timepicker.init(registry.Timepicker, {});
  Tooltip.init(registry.Tooltip, {});
  FloatingActionButton.init(registry.FloatingActionButton, {});
}

// Init

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', Utils.docHandleKeydown, true);
  document.addEventListener('keyup', Utils.docHandleKeyup, true);
  document.addEventListener('focus', Utils.docHandleFocus, true);
  document.addEventListener('blur', Utils.docHandleBlur, true);
}
Cards.Init();
Forms.Init();
Chips.Init();
Waves.Init();
Range.Init();
