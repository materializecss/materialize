/* eslint-disable @typescript-eslint/no-unused-vars */
import { Autocomplete, AutocompleteOptions } from '../components/search/autocomplete';
import { FloatingActionButton, FloatingActionButtonOptions } from '../components/buttons/buttons';
import { Cards, CardsOptions } from '../components/cards/cards';
import { Carousel, CarouselOptions } from '../components/carousel/carousel';
import { Chips, ChipsOptions } from '../components/chips/chips';
import { Collapsible, CollapsibleOptions } from '../components/collapsible/collapsible';
import { Datepicker, DatepickerOptions } from '../components/datepicker/datepicker';
import { Dropdown, DropdownOptions } from '../components/dropdown/dropdown';
import { Forms } from '../components/text-fields/forms';
import { Materialbox, MaterialboxOptions } from '../components/dialog/materialbox';
import { Modal, ModalOptions } from '../components/dialog/modal';
import { FormSelect, FormSelectOptions } from '../components/text-fields/select';
import { Sidenav, SidenavOptions } from '../components/navigation-drawer/sidenav';
import { Slider, SliderOptions } from '../components/carousel/slider';
import { Tabs, TabsOptions } from '../components/tabs/tabs';
import { Timepicker, TimepickerOptions } from '../components/timepicker/timepicker';
import { Toast, ToastOptions } from '../components/snackbar/toasts';
import { Tooltip, TooltipOptions } from '../components/tooltips/tooltip';
import { Range } from '../components/sliders/range';

import { TapTarget, TapTargetOptions } from './tapTarget';
import { CharacterCounter /*, CharacterCounterOptions*/ } from './characterCounter';
import { Parallax, ParallaxOptions } from './parallax';
import { Pushpin, PushpinOptions } from './pushpin';
import { ScrollSpy, ScrollSpyOptions } from './scrollspy';
import { Waves } from './waves';
import { Utils } from './utils';
import { Component } from './component';
/* eslint-enable @typescript-eslint/no-unused-vars */

export {
  Autocomplete,
  FloatingActionButton,
  Cards,
  Carousel,
  CharacterCounter,
  Chips,
  Collapsible,
  Datepicker,
  Dropdown,
  Forms,
  Materialbox,
  Modal,
  Parallax,
  Pushpin,
  ScrollSpy,
  FormSelect,
  Sidenav,
  Slider,
  Tabs,
  TapTarget,
  Timepicker,
  Toast,
  Tooltip,
  Waves,
  Range
};

export const version = '2.3.1';

export interface AutoInitOptions {
  Autocomplete?: Partial<AutocompleteOptions>;
  Cards?: Partial<CardsOptions>;
  Carousel?: Partial<CarouselOptions>;
  Chips?: Partial<ChipsOptions>;
  Collapsible?: Partial<CollapsibleOptions>;
  Datepicker?: Partial<DatepickerOptions>;
  Dropdown?: Partial<DropdownOptions>;
  Materialbox?: Partial<MaterialboxOptions>;
  Modal?: Partial<ModalOptions>;
  Parallax?: Partial<ParallaxOptions>;
  Pushpin?: Partial<PushpinOptions>;
  ScrollSpy?: Partial<ScrollSpyOptions>;
  FormSelect?: Partial<FormSelectOptions>;
  Sidenav?: Partial<SidenavOptions>;
  Tabs?: Partial<TabsOptions>;
  TapTarget?: Partial<TapTargetOptions>;
  Timepicker?: Partial<TimepickerOptions>;
  Tooltip?: Partial<TooltipOptions>;
  FloatingActionButton?: Partial<FloatingActionButtonOptions>;
}

/**
 * Automatically initialize components.
 * @param context Root element to initialize. Defaults to `document.body`.
 * @param options Options for each component.
 */
export function AutoInit(context: HTMLElement = document.body, options?: Partial<AutoInitOptions>) {
  const registry = {
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
  Cards.init(registry.Cards, options?.Cards ?? {});
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
Cards.Init();
