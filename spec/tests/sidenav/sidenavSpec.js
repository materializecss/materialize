describe('Sidenav Plugin', () => {
  const fixture = `<ul id="slide-out" class="sidenav">
  <li><div class="user-view">
    <div class="background">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
    </div>
    <a href="#!user"><img class="circle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="></a>
    <a href="#!name"><span class="white-text name">John Doe</span></a>
    <a href="#!email"><span class="white-text email">jdoe@example.com</span></a>
  </div></li>
  <li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
  <li><a href="#!">Second Link</a></li>
  <li><div class="divider"></div></li>
  <li><a class="subheader">Subheader</a></li>
  <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>
<a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Sidenav', () => {
    afterEach(() => {
      if (M.Sidenav._sidenavs.length)
        M.Sidenav.getInstance(document.querySelector('#slide-out')).destroy();
    });

    it('should not break from multiple initializations', () => {
      expect(M.Sidenav._sidenavs.length).toEqual(0, 'no sidenavs initialized');
      M.Sidenav.init(document.querySelector('#slide-out'));
      M.Sidenav.init(document.querySelector('#slide-out'));
      M.Sidenav.init(document.querySelector('#slide-out'));
      expect(M.Sidenav._sidenavs.length).toEqual(
        1,
        'only 1 sidenav initialized after multiple calls on the same element'
      );
      const dragTarget = document.querySelectorAll('.drag-target');
      expect(dragTarget.length).toEqual(1, 'Should generate only one dragTarget.');
      const overlay = document.querySelectorAll('.sidenav-overlay');
      expect(overlay.length).toEqual(1, 'Should generate only one overlay.');
    });

    it('should open sidenav from left', (done) => {
      const normalActivator = document.querySelector('.sidenav-trigger');
      const normalSidenav = document.querySelector('.sidenav');
      const slideOutSlidenav = M.Sidenav.init(document.querySelector('#slide-out'), {
        inDuration: 0,
        outDuration: 0
      });
      const overlay = document.querySelectorAll('.sidenav-overlay');
      const dragTarget = document.querySelectorAll('.drag-target');
      let sidenavRect = normalSidenav.getBoundingClientRect();
      expect(dragTarget.length).toEqual(1, 'Should generate only one dragTarget.');
      expect(overlay.length).toEqual(1, 'Should generate only one overlay.');
      expect(sidenavRect.left).toEqual(
        -sidenavRect.width * 1.05,
        'Should be hidden before sidenav is opened.'
      );
      click(normalActivator);
      setTimeout(() => {
        sidenavRect = normalSidenav.getBoundingClientRect();
        expect(sidenavRect.left).toEqual(0, 'Should be shown after sidenav is closed.');
        click(slideOutSlidenav._overlay);
        done();
      }, 10);
    });

    it('should have working callbacks', (done) => {
      const normalActivator = document.querySelector('.sidenav-trigger');
      let openStart = false;
      let openEnd = false;
      let closeStart = false;
      let closeEnd = false;
      const sidenav = M.Sidenav.init(document.querySelector('#slide-out'), {
        inDuration: 0,
        outDuration: 0,
        onOpenStart: () => {
          openStart = true;
        },
        onOpenEnd: () => {
          openEnd = true;
        },
        onCloseStart: () => {
          closeStart = true;
        },
        onCloseEnd: () => {
          closeEnd = true;
        }
      });
      const overlay = sidenav._overlay;
      click(normalActivator);
      expect(openStart).toEqual(true, 'Open start should fire immediately after open');
      expect(openEnd).toEqual(false, 'Open end should not fire immediately after open');
      setTimeout(() => {
        expect(openEnd).toEqual(true, 'Open end should fire after open animation');
        click(overlay);
        expect(closeStart).toEqual(true, 'Close start should fire immediately after close');
        expect(closeEnd).toEqual(false, 'Close end should not fire immediately after close');
        setTimeout(() => {
          expect(closeEnd).toEqual(true, 'Close end should fire after close animation');
          done();
        }, 10);
      }, 10);
    });

    it('should destroy correctly', function (done) {
      expect(M.Sidenav._sidenavs.length).toEqual(0, 'no sidenavs initialized');
      const sidenav = M.Sidenav.init(document.querySelector('#slide-out'));
      const overlay = sidenav._overlay;
      const dragTarget = sidenav.dragTarget;
      expect(M.Sidenav._sidenavs.length).toEqual(1, 'one sidenav initialized');
      expect(document.contains(overlay)).toEqual(true, 'overlay should be in DOM');
      expect(document.contains(dragTarget)).toEqual(true, 'dragTarget should be in DOM');
      sidenav.destroy();
      setTimeout(() => {
        expect(M.Sidenav._sidenavs.length).toEqual(0, 'sidenav destroyed');
        expect(document.contains(overlay)).toBeFalse('overlay should be deleted');
        expect(document.contains(dragTarget)).toBeFalse('dragTarget should be deleted');
        done();
      }, 10);
    });
  });
});
