/* eslint-disable no-undef */

describe('Toasts:', () => {
  describe('Toast javascript functions', () => {
    it('should display and remove a toast', (done) => {
      const instance = new M.Toast({
        text: 'Test toast',
        inDuration: 20,
        displayLength: 100,
        outDuration: 20
      });
      const wrapperWasCreated = document.querySelectorAll('#toast-container').length === 1;
      expect(wrapperWasCreated).toEqual(true, 'because toast was created');
      const toast = instance.el;
      setTimeout(() => {
        // is visible?
        //const toasts = document.querySelectorAll('.toast');
        //const toast = toasts[0];
        //expect(toasts.length).toBe(1, 'because one toast was created');
        expect(toast.getAttribute('role')).toBe('alert');
        expect(toast.getAttribute('aria-live')).toBe('assertive');
        expect(toast.getAttribute('aria-atomic')).toBe('true');
        expect(toast).toBeVisible();
        expect(toast.innerText).toBe('Test toast');
        setTimeout(() => {
          //const toasts = document.querySelectorAll('.toast');
          expect(toast).toBeVisible();
          //expect(toasts.length).toBe(1, 'because toast duration still on going');
          setTimeout(() => {
            //const toasts = document.querySelectorAll('.toast');
            //console.log();
            expect(typeof toast.el).toBe('undefined', 'because toast should be removed by now');
            done();
          }, 150);
        }, 30);
      }, 10);
    });

    // it('Opens a toast with HTML content', function(done) {
    //   let toastContent = document.createElement("span");
    //   toastContent.innerText = 'I am toast content';
    //   M.toast({html: toastContent.outerHTML, displayLength: 400});
    //   let toastSpan = document.querySelector('.toast span');
    //   expect(toastSpan.innerText).toBe('I am toast content');
    //   expect(toastSpan.innerText).not.toBe('I am toast');
    //   setTimeout(function() {
    //     done();
    //   }, 490);
    // });

    it('Toasts should call the callback function when dismissed', (done) => {
      let wasCalled = false;
      const callback = () => (wasCalled = true);
      const toast = new M.Toast({
        text: 'I am a toast',
        inDuration: 10,
        displayLength: 50,
        outDuration: 10,
        completeCallback: callback
      });
      setTimeout(() => {
        expect(wasCalled).toBe(true, 'because the callback set it to true');
        done();
      }, 100);
    });

    it('should apply classes to toast', (done) => {
      const toast = new M.Toast({
        text: 'Hi',
        displayLength: 100,
        inDuration: 10,
        outDuration: 10,
        classes: 'round flat'
      });
      setTimeout(() => {
        const toastFlat = document.querySelectorAll('.toast.round.flat');
        expect(toastFlat.length).toBe(1, 'because the class parameter was passed with two classes');
        done();
      }, 20);
    });
  });
});
