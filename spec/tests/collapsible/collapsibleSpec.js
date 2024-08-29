/* eslint-disable no-undef */

describe('Collapsible Plugin:', () => {
  let collapsible, accordion, popout, expandable, expandablePreselect;

  const fixture = `<ul class="collapsible expandable" data-collapsible="expandable">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>
<ul class="collapsible expandable-preselected" data-collapsible="expandable">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li class="active">
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>


<ul class="collapsible accordion" data-collapsible="accordion">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>

<ul class="collapsible popout" data-collapsible="expandable">
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
</ul>`;

  beforeEach(() => {
    XloadHtml(fixture);
    collapsible = document.querySelectorAll('.collapsible');
    expandable = document.querySelector('.expandable');
    expandablePreselect = document.querySelector('.expandable-preselected');
    accordion = document.querySelector('.accordion');
    popout = document.querySelector('.popout');
    M.Collapsible.init(collapsible, { inDuration: 0, outDuration: 0 });
    M.Collapsible.init(expandable, { accordion: false, inDuration: 0, outDuration: 0 });
    M.Collapsible.init(expandablePreselect, { accordion: false, inDuration: 0, outDuration: 0 });
  });

  afterEach(() => XunloadFixtures());

  describe('collapsible', () => {
    it('should open all items, keeping all open', (done) => {
      // Collapsible body height should be 0 on start when hidden.
      let headers = expandable.querySelectorAll('.collapsible-header');
      let bodies = expandable.querySelectorAll('.collapsible-body');
      for (let i = 0; i < bodies.length; i++) {
        expect(bodies[i]).hasMaxHeightZero(
          'because collapsible bodies should be hidden initially.'
        );
        //TODO replace with alternative for deprecated jasmine-jquery
      }
      // Collapsible body height should be > 0 after being opened.
      for (let i = 0; i < headers.length; i++) {
        click(headers[i]);
      }
      setTimeout(() => {
        for (let i = 0; i < bodies.length; i++) {
          expect(bodies[i]).notHasMaxHeightZero(
            'because collapsible bodies not visible after being opened.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        }
        done();
      }, 10);
    });

    it('should allow preopened sections', () => {
      let bodies = expandablePreselect.querySelectorAll('.collapsible-body');
      for (let i = 0; i < bodies.length; i++) {
        let headerLi = bodies[i].parentNode;
        if (i === 1) {
          expect(headerLi).toHaveClass(
            'active',
            'because collapsible header should have active class to be preselected.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
          expect(bodies[i]).notHasMaxHeightZero(
            'because collapsible bodies should be visible if preselected.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        } else {
          expect(bodies[i]).hasMaxHeightZero(
            'because collapsible bodies should be hidden initially.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
        }
      }
    });

    it('should open and close programmatically with callbacks', (done) => {
      let openCallback = false;
      let closeCallback = false;
      M.Collapsible.init(expandable, {
        accordion: false,
        onOpenStart: () => {
          openCallback = true;
        },
        onCloseStart: () => {
          closeCallback = true;
        },
        inDuration: 0,
        outDuration: 0
      });
      let bodies = expandable.querySelectorAll('.collapsible-body');
      expect(openCallback).toEqual(false, 'because open callback not yet fired');
      expect(closeCallback).toEqual(false, 'because close callback not yet fired');
      for (let i = 0; i < bodies.length; i++) {
        //TODO replace with alternative for deprecated jasmine-jquery
        expect(bodies[i]).hasMaxHeightZero(
          'because collapsible bodies should be hidden initially.'
        );
        let collapsibleInstance = M.Collapsible.getInstance(bodies[i].parentNode.parentNode);
        collapsibleInstance.open(i);
      }
      expect(openCallback).toEqual(true, 'because open callback fired');
      setTimeout(() => {
        for (let i = 0; i < bodies.length; i++) {
          expect(bodies[i]).notHasMaxHeightZero(
            'because collapsible bodies should be visible after being opened.'
          ); //TODO replace with alternative for deprecated jasmine-jquery
          M.Collapsible.getInstance(bodies[i].parentNode.parentNode).close(i);
        }
        expect(closeCallback).toEqual(true, 'because close callback fired');
        setTimeout(() => {
          for (let i = 0; i < bodies.length; i++) {
            expect(bodies[i]).hasMaxHeightZero(
              'because collapsible bodies should be hidden after close.'
            ); //TODO replace with alternative for deprecated jasmine-jquery
          }
          done();
        }, 10);
      }, 10);
    });
  });

  describe('accordion', () => {
    it('should open first and second items, keeping only second open', (done) => {
      // Collapsible body height should be 0 on start when hidden.
      let firstHeader = accordion.querySelector('.collapsible-header');
      let firstBody = accordion.querySelector('.collapsible-body');
      let secondHeader = accordion.querySelectorAll('.collapsible-header')[1];
      let secondBody = accordion.querySelectorAll('.collapsible-body')[1];
      expect(firstBody).hasMaxHeightZero('because accordion bodies should be hidden initially.');
      expect(secondBody).hasMaxHeightZero('because accordion bodies should be hidden initially.');
      // Collapsible body height should be > 0 after being opened.
      firstHeader.click();
      setTimeout(() => {
        expect(firstBody).notHasMaxHeightZero(
          'because accordion bodies not visible after being opened.'
        );
        click(secondHeader);
        setTimeout(() => {
          expect(firstBody).hasMaxHeightZero(
            'because accordion bodies should be hidden when another item is opened.'
          );
          expect(secondBody).notHasMaxHeightZero(
            'because accordion bodies not visible after being opened.'
          );
          done();
        }, 10);
      }, 10);
    });
  });

  describe('popout', () => {
    it('should open first and popout', (done) => {
      // Collapsible body height should be 0 on start when hidden.
      let listItems = popout.querySelectorAll('li');
      let firstHeader = popout.querySelector('.collapsible-header');
      let firstBody = popout.querySelector('.collapsible-body');
      expect(firstBody).hasMaxHeightZero('because accordion bodies should be hidden initially.');
      // Expect margin to be > 0 because not popped out.
      for (let i = 0; i < listItems.length; i++) {
        let listItemStyles = getComputedStyle(listItems[i]);
        let marginLeft = parseInt(listItemStyles.getPropertyValue('margin-left'));
        let marginRight = parseInt(listItemStyles.getPropertyValue('margin-right'));
        expect(marginLeft).toBeGreaterThan(
          0,
          'because closed popout items should have horizontal margins.'
        );
        expect(marginRight).toBeGreaterThan(
          0,
          'because closed popout items should have horizontal margins.'
        );
      }
      // expect margin to be 0 because popped out.
      click(firstHeader);
      setTimeout(() => {
        const firstStyles = getComputedStyle(listItems[0]);
        const firstMarginLeft = parseInt(firstStyles.getPropertyValue('margin-left'));
        const firstMarginRight = parseInt(firstStyles.getPropertyValue('margin-right'));
        expect(firstMarginLeft).toEqual(
          0,
          'because opened popout items should have no horizontal margins.'
        );
        expect(firstMarginRight).toEqual(
          0,
          'because opened popout items should have no horizontal margins.'
        );
        expect(firstBody).notHasMaxHeightZero(
          'because accordion bodies not visible after being opened.'
        );
        done();
      }, 300);
    });
  });
});
