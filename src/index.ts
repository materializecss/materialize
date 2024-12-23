import { Autocomplete, AutocompleteOptions } from './autocomplete';
import { FloatingActionButton, FloatingActionButtonOptions } from './buttons';
import { Cards, CardsOptions } from './cards';
import { Carousel, CarouselOptions } from './carousel';
import { CharacterCounter, CharacterCounterOptions } from './characterCounter';
import { Chips, ChipsOptions } from './chips';
import { Collapsible, CollapsibleOptions } from './collapsible';
import { Datepicker, DatepickerOptions } from './datepicker';
import { Dropdown, DropdownOptions } from './dropdown';
import { Forms } from './forms';
import { Materialbox, MaterialboxOptions } from './materialbox';
import { Modal, ModalOptions } from './modal';
import { Parallax, ParallaxOptions } from './parallax';
import { Pushpin, PushpinOptions } from './pushpin';
import { ScrollSpy, ScrollSpyOptions } from './scrollspy';
import { FormSelect, FormSelectOptions } from './select';
import { Sidenav, SidenavOptions } from './sidenav';
import { Slider, SliderOptions } from './slider';
import { Tabs, TabsOptions } from './tabs';
import { TapTarget, TapTargetOptions } from './tapTarget';
import { Timepicker, TimepickerOptions } from './timepicker';
import { Toast, ToastOptions } from './toasts';
import { Tooltip, TooltipOptions } from './tooltip';
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

export const version = '2.2.0';

export const Grid = (children: any = '') => {
  return `<div class="row">${children}</row>`;
};

export function Button(children: any = '') {
  return `<button class="btn">${children}</button>`;
}

export interface AutoInitOptions {
  Autocomplete?: Partial<AutocompleteOptions>
  Cards?: Partial<CardsOptions>
  Carousel?: Partial<CarouselOptions>
  Chips?: Partial<ChipsOptions>
  Collapsible?: Partial<CollapsibleOptions>
  Datepicker?: Partial<DatepickerOptions>
  Dropdown?: Partial<DropdownOptions>
  Materialbox?: Partial<MaterialboxOptions>
  Modal?: Partial<ModalOptions>
  Parallax?: Partial<ParallaxOptions>
  Pushpin?: Partial<PushpinOptions>
  ScrollSpy?: Partial<ScrollSpyOptions>
  FormSelect?: Partial<FormSelectOptions>
  Sidenav?: Partial<SidenavOptions>
  Tabs?: Partial<TabsOptions>
  TapTarget?: Partial<TapTargetOptions>
  Timepicker?: Partial<TimepickerOptions>
  Tooltip?: Partial<TooltipOptions>
  FloatingActionButton?: Partial<FloatingActionButtonOptions>
}

/**
 * Automatically initialize components.
 * @param context Root element to initialize. Defaults to `document.body`.
 * @param options Options for each component.
 */
export function AutoInit(context: HTMLElement = document.body, options?: Partial<AutoInitOptions>) {
  let registry = {
    Autocomplete: context.querySelectorAll('.autocomplete:not(.no-autoinit)'),
    Cards: context.querySelectorAll('.cards:not(.no-autoinit)'),
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
  Autocomplete.init(registry.Autocomplete, options?.Autocomplete ?? {});
  Cards.init(registry.Cards, options?.Cards ?? {})
  Carousel.init(registry.Carousel, options?.Carousel ?? {});
  Chips.init(registry.Chips, options?.Chips ?? {});
  Collapsible.init(registry.Collapsible, options?.Collapsible ?? {});
  Datepicker.init(registry.Datepicker, options?.Datepicker ?? {});
  Dropdown.init(registry.Dropdown, options?.Dropdown ?? {});
  Materialbox.init(registry.Materialbox, options?.Materialbox ?? {});
  Modal.init(registry.Modal, options?.Modal ?? {});
  Parallax.init(registry.Parallax, options?.Parallax ?? {});
  Pushpin.init(registry.Pushpin, options?.Pushpin ?? {});
  ScrollSpy.init(registry.ScrollSpy, options?.ScrollSpy ?? {});
  FormSelect.init(registry.FormSelect, options?.FormSelect ?? {});
  Sidenav.init(registry.Sidenav, options?.Sidenav ?? {});
  Tabs.init(registry.Tabs, options?.Tabs ?? {});
  TapTarget.init(registry.TapTarget, options?.TapTarget ?? {});
  Timepicker.init(registry.Timepicker, options?.Timepicker ?? {});
  Tooltip.init(registry.Tooltip, options?.Tooltip ?? {});
  FloatingActionButton.init(registry.FloatingActionButton, options?.FloatingActionButton ?? {});
}

// Init

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', Utils.docHandleKeydown, true);
  document.addEventListener('keyup', Utils.docHandleKeyup, true);
  document.addEventListener('focus', Utils.docHandleFocus, true);
  document.addEventListener('blur', Utils.docHandleBlur, true);
}
Forms.Init();
Chips.Init();
Waves.Init();
Range.Init();
