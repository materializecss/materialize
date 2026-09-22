import { Autocomplete } from './autocomplete/autocomplete';
import { Button } from './button/button';
import { Cards } from './card/cards';
import { Carousel, Slider } from './carousel/carousel';
import { CharacterCounter } from './textfield/characterCounter';
import { Chips } from './chip/chips';
import { Collapsible } from './collapsible/collapsible';
import { Datepicker } from './datepicker/datepicker';
import { Dropdown } from './dropdown/dropdown';
import { Forms } from './textfield/forms';
import { FormSelect } from './textfield/select';
import { FloatingActionButton } from './button/floatingactionbutton';
import { Modal } from './dialog/modal';
import { ScrollSpy } from './scrollspy/scrollspy';
import { Sidenav } from './navigation-drawer/sidenav';
import { Tabs } from './tabs/tabs';
import { TextField } from './textfield/textfield.mjs';
import { Timepicker } from './timepicker/timepicker';
import { Toast } from './snackbar/toasts';
import { Tooltip } from './tooltip/tooltip';
import { Range } from './slider/range';
import { Waves } from './ripple/waves';
import { Utils } from './utils';

const version = '2.3.3';

/**
 * Automatically initialize components.
 * @param context Root element to initialize. Defaults to `document.body`.
 * @param options Options for each component.
 */
function AutoInit(context = document.body, options) {
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
  Modal.init(registry.Modal, options?.Modal ?? {});
  ScrollSpy.init(registry.ScrollSpy, options?.ScrollSpy ?? {});
  FormSelect.init(registry.FormSelect, options?.FormSelect ?? {});
  Sidenav.init(registry.Sidenav, options?.Sidenav ?? {});
  Tabs.init(registry.Tabs, options?.Tabs ?? {});
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

export {
  AutoInit,
  version,
  // components:
  Autocomplete,
  Button,
  Cards,
  Carousel,
  CharacterCounter,
  Chips,
  Collapsible,
  Datepicker,
  Dropdown,
  FloatingActionButton,
  FormSelect,
  Forms,
  Modal,
  Range,
  ScrollSpy,
  Sidenav,
  Slider,
  Tabs,
  TextField,
  Timepicker,
  Toast,
  Tooltip,
  Waves
};
