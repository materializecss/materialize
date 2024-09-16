import { Utils } from './utils';

export class Forms {
  /**
   * Resizes the given TextArea after updating the
   *  value content dynamically.
   * @param textarea TextArea to be resized
   */
  static textareaAutoResize(textarea: HTMLTextAreaElement) {
    if (!textarea) {
      console.error('No textarea element found');
      return;
    }
    // Textarea Auto Resize
    let hiddenDiv: HTMLDivElement = document.querySelector('.hiddendiv');
    if (!hiddenDiv) {
      hiddenDiv = document.createElement('div');
      hiddenDiv.classList.add('hiddendiv', 'common');
      document.body.append(hiddenDiv);
    }
    const style = getComputedStyle(textarea);
    // Set font properties of hiddenDiv
    const fontFamily = style.fontFamily; //textarea.css('font-family');
    const fontSize = style.fontSize; //textarea.css('font-size');
    const lineHeight = style.lineHeight; //textarea.css('line-height');
    // Firefox can't handle padding shorthand.
    const paddingTop = style.paddingTop; //getComputedStyle(textarea).css('padding-top');
    const paddingRight = style.paddingRight; //textarea.css('padding-right');
    const paddingBottom = style.paddingBottom; //textarea.css('padding-bottom');
    const paddingLeft = style.paddingLeft; //textarea.css('padding-left');

    if (fontSize) hiddenDiv.style.fontSize = fontSize; //('font-size', fontSize);
    if (fontFamily) hiddenDiv.style.fontFamily = fontFamily; //css('font-family', fontFamily);
    if (lineHeight) hiddenDiv.style.lineHeight = lineHeight; //css('line-height', lineHeight);
    if (paddingTop) hiddenDiv.style.paddingTop = paddingTop; //ss('padding-top', paddingTop);
    if (paddingRight) hiddenDiv.style.paddingRight = paddingRight; //css('padding-right', paddingRight);
    if (paddingBottom) hiddenDiv.style.paddingBottom = paddingBottom; //css('padding-bottom', paddingBottom);
    if (paddingLeft) hiddenDiv.style.paddingLeft = paddingLeft; //css('padding-left', paddingLeft);

    // Set original-height, if none
    if (!textarea.hasAttribute('original-height'))
      textarea.setAttribute('original-height', textarea.getBoundingClientRect().height.toString());

    if (textarea.getAttribute('wrap') === 'off') {
      hiddenDiv.style.overflowWrap = 'normal'; // ('overflow-wrap', 'normal')
      hiddenDiv.style.whiteSpace = 'pre'; //.css('white-space', 'pre');
    }

    hiddenDiv.innerText = textarea.value + '\n';

    const content = hiddenDiv.innerHTML.replace(/\n/g, '<br>');
    hiddenDiv.innerHTML = content;

    // When textarea is hidden, width goes crazy.
    // Approximate with half of window size
    if (textarea.offsetWidth > 0 && textarea.offsetHeight > 0) {
      hiddenDiv.style.width = textarea.getBoundingClientRect().width + 'px'; // ('width', textarea.width() + 'px');
    } else {
      hiddenDiv.style.width = window.innerWidth / 2 + 'px'; //css('width', window.innerWidth / 2 + 'px');
    }

    // Resize if the new height is greater than the
    // original height of the textarea
    const originalHeight = parseInt(textarea.getAttribute('original-height'));
    const prevLength = parseInt(textarea.getAttribute('previous-length'));
    if (isNaN(originalHeight)) return;
    if (originalHeight <= hiddenDiv.clientHeight) {
      textarea.style.height = hiddenDiv.clientHeight + 'px'; //css('height', hiddenDiv.innerHeight() + 'px');
    } else if (textarea.value.length < prevLength) {
      // In case the new height is less than original height, it
      // means the textarea has less text than before
      // So we set the height to the original one
      textarea.style.height = originalHeight + 'px';
    }
    textarea.setAttribute('previous-length', textarea.value.length.toString());
  }

  static Init() {
    if (typeof document !== 'undefined')
      document?.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('keyup', (e: KeyboardEvent) => {
          const target = <HTMLInputElement>e.target;
          // Radio and Checkbox focus class
          if (target instanceof HTMLInputElement && ['radio', 'checkbox'].includes(target.type)) {
            // TAB, check if tabbing to radio or checkbox.
            if (Utils.keys.TAB.includes(e.key)) {
              target.classList.add('tabbed');
              target.addEventListener('blur', (e) => target.classList.remove('tabbed'), {
                once: true
              });
            }
          }
        });

        document
          .querySelectorAll('.materialize-textarea')
          .forEach((textArea: HTMLTextAreaElement) => {
            Forms.InitTextarea(textArea);
          });

        // File Input Path
        document
          .querySelectorAll('.file-field input[type="file"]')
          .forEach((fileInput: HTMLInputElement) => {
            Forms.InitFileInputPath(fileInput);
          });
      });
  }

  static InitTextarea(textarea: HTMLTextAreaElement) {
    // Save Data in Element
    textarea.setAttribute('original-height', textarea.getBoundingClientRect().height.toString());
    textarea.setAttribute('previous-length', textarea.value.length.toString());
    Forms.textareaAutoResize(textarea);

    textarea.addEventListener('keyup', (e) => Forms.textareaAutoResize(textarea));
    textarea.addEventListener('keydown', (e) => Forms.textareaAutoResize(textarea));
  }

  static InitFileInputPath(fileInput: HTMLInputElement) {
    fileInput.addEventListener('change', (e) => {
      const fileField = fileInput.closest('.file-field');
      const pathInput = <HTMLInputElement>fileField.querySelector('input.file-path');
      const files = fileInput.files;
      const filenames = [];
      for (let i = 0; i < files.length; i++) {
        filenames.push(files[i].name);
      }
      pathInput.value = filenames.join(', ');
      pathInput.dispatchEvent(
        new Event('change', { bubbles: true, cancelable: true, composed: true })
      );
    });
  }
}
