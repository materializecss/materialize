const MULTILINE_TEXT = 'This is line 1.\nThis is line 2.\nThis is line 3.\nThis is line 4.\nThis is line 5.\nAnd this is line 6.';

describe('Forms:', function () {
  beforeEach(async function () {
    await XloadFixtures(['forms/formsFixture.html']);
    M.CharacterCounter.init(document.querySelector('#character-counter'));
  });

  afterEach(function () {
    XunloadFixtures();
  });

  let inputs;

  beforeEach(function () {
    inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.focus();
      input.blur();
    });
    window.location.hash = '';
  });

  describe('CharacterCounter', () => {
    it('Should initialize', () => {
      let el = document.querySelector('#character-counter');
      expect(() => M.CharacterCounter.getInstance(el)).not.toThrow();
      expect(M.CharacterCounter.getInstance(el)).toBeTruthy();
    });

    it('Should exhibit counter', () => {
      let counter = document.querySelector('#character-counter ~ .character-counter');
      expect(counter.textContent).toBe('0/10');
    });
  });

  describe('TextArea Resize', () => {
    it('Should resize', () => {
      const el = document.querySelector('#textarea');
      const pHeight = el.clientHeight;
      el.value = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eleifend urna orci, vitae sagittis ligula maximus quis. Duis eleifend ipsum vitae facilisis tincidunt. Aliquam condimentum consequat ex, ut commodo purus tristique at. Donec malesuada fringilla libero vel sodales. Nulla finibus volutpat lectus a varius. Praesent consequat ornare pulvinar. Quisque nec massa diam.
        Nunc commodo tempus suscipit. Phasellus iaculis at lorem sit amet venenatis. Curabitur quis felis elementum enim fermentum dapibus. In pretium finibus mollis. Nam aliquet tristique diam sit amet ullamcorper. Suspendisse interdum, est sed aliquam dignissim, dolor augue tristique dui, non luctus felis dolor a dui. Suspendisse lacinia lorem nec enim ultricies maximus. Aenean quam erat, finibus non aliquam nec, pharetra vel metus. Nulla dignissim maximus cursus.
        Integer massa est, semper eget sem quis, bibendum scelerisque odio. Nam sit amet urna auctor, luctus odio in, semper dui. Sed ut gravida libero, ac consectetur sem. Etiam pharetra pulvinar leo, eget imperdiet purus faucibus in. Cras blandit mi ullamcorper nulla viverra posuere. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec pretium euismod tortor a lacinia. Vivamus ultrices vulputate purus et blandit. Fusce mi quam, consequat vitae pretium sed, tempus at ligula.
        Suspendisse sodales et dolor vitae sollicitudin. Curabitur sed vestibulum sapien. Integer porttitor pulvinar ullamcorper. Sed ultrices varius augue, at bibendum magna congue sit amet. Nam enim purus, fermentum sed feugiat viverra, accumsan nec diam. Donec a auctor est. Aenean non ante metus. Pellentesque ante ligula, varius vel dignissim in, euismod vel diam. Donec est ante, rhoncus at eros sed, cursus pulvinar enim. In pellentesque, erat eu egestas tempor, ipsum turpis ornare dui, sed fringilla sem lorem in ligula.
        Integer facilisis arcu eu posuere placerat. Nam vel leo magna. Proin mattis feugiat nisi, quis tincidunt magna pulvinar tincidunt. Aliquam eget nunc sapien. Maecenas vitae orci nunc. Nulla condimentum sapien quis sapien varius suscipit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non finibus nisl, et venenatis massa.
      `.trim();
      M.Forms.textareaAutoResize(el);
      expect(el.clientHeight).toBeGreaterThan(pHeight);
    });

    it('Programmatically initialized textarea resize', () => {
      const element = document.querySelector('#textarea');
      M.Forms.InitTextarea(element);
      const textareaHeight = element.clientHeight;
      element.value = MULTILINE_TEXT;
      keydown(element, 13);
      expect(element.clientHeight).toBeGreaterThan(textareaHeight);
    });

    it('Automatically initialized textarea resize', () => {
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const element = document.querySelector('#textarea');
      const textareaHeight = element.clientHeight;
      element.value = MULTILINE_TEXT;
      keydown(element, 13);
      expect(element.clientHeight).toBeGreaterThan(textareaHeight);
    });
  });

  // No active class added, because it is now a css feature only
  /*
  it("should keep label active while focusing on input", function () {
    inputs.forEach(input => {
      expect(input.labels[0]).not.toHaveClass('active')
      input.focus()
      expect(input.labels[0]).toHaveClass('active')
      input.blur()
      expect(input.labels[0]).not.toHaveClass('active')
    })
  });
  */
});
