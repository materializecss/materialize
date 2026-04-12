describe('Cards', () => {
  const fixture = `
    <div class="row">
      <div class="col s12 m6">
        <div class="card reveal">
          <div class="card-image waves-effect waves-block waves-light">
            <img
              class="activator"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">
              Card Title
              <i class="material-icons right">more_vert</i>
            </span>
            <p><a href="#">This is a link</a></p>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">
              Card Title
              <i class="material-icons right">close</i>
            </span>
            <p>
              Here is some more information about this product that is only revealed once clicked on.
            </p>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card image">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s4">
        <div class="card small">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>

      <div class="col s4">
        <div class="card medium">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>

      <div class="col s4">
        <div class="card large">
          <div class="card-image">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
            >
            <span class="card-title">Card Title</span>
          </div>
          <div class="card-content">
            <p>
              I am a very simple card. I am good at containing small bits of information.
              I am convenient because I require little markup to use effectively.
            </p>
          </div>
          <div class="card-action">
            <a href="#">This is a link</a>
            <a href="#">This is a link</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const roundedRect = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom)
    };
  };

  beforeEach(() => {
    XloadHtml(fixture);
    M.Cards.init(document.querySelectorAll('.card'));
  });

  afterEach(() => {
    XunloadFixtures();
  });

  describe('reveal cards', () => {
    let revealCard;
    let revealDiv;

    beforeEach(() => {
      revealCard = document.querySelector('.card.reveal');
      revealDiv = revealCard.querySelector('.card-reveal');
    });

    it('should have a hidden card-reveal initially', () => {
      expect(revealDiv).toBeHidden('reveal div should be hidden initially');
    });

    it('should show card-reveal after clicking an activator', (done) => {
      const activator = revealCard.querySelector('.activator');

      click(activator);

      setTimeout(() => {
        expect(revealDiv).toBeVisible('reveal did not appear after activator was clicked.');
        done();
      }, 500);
    });

    it('should size and position card-reveal to cover the card when opened', (done) => {
      const activator = revealCard.querySelector('.activator');

      click(activator);

      setTimeout(() => {
        const revealRect = roundedRect(revealDiv);
        const cardRect = roundedRect(revealCard);

        expect(revealDiv).toBeVisible('reveal did not appear after activator was clicked.');
        expect(revealRect.width).toEqual(cardRect.width, 'reveal width should match card width');
        expect(revealRect.height).toEqual(
          cardRect.height,
          'reveal height should match card height'
        );
        expect(revealRect.top).toEqual(cardRect.top, 'reveal top should align with card top');
        expect(revealRect.left).toEqual(cardRect.left, 'reveal left should align with card left');

        done();
      }, 500);
    });
  });

  describe('image cards', () => {
    let imageCard;
    let image;

    beforeEach(() => {
      imageCard = document.querySelector('.card.image');
      image = imageCard.querySelector('.card-image > img');
    });

    it('should have an image that fills the full width of the card', () => {
      const imageRect = roundedRect(image);
      const cardRect = roundedRect(imageCard);

      expect(imageRect.width).toEqual(cardRect.width, 'image does not fill width of card');
      expect(imageRect.top).toEqual(cardRect.top, 'image top should align with card top');
    });
  });

  describe('sized cards', () => {
    const expectSizedCardLayout = ({
      card,
      expectedHeight,
      maxImageHeight,
      maxContentHeight,
      sizeName
    }) => {
      const cardImage = card.querySelector('.card-image');
      const cardContent = card.querySelector('.card-content');
      const cardAction = card.querySelector('.card-action');

      const cardRect = roundedRect(card);
      const imageRect = roundedRect(cardImage);
      const contentRect = roundedRect(cardContent);
      const actionRect = roundedRect(cardAction);

      expect(cardRect.height).toEqual(
        expectedHeight,
        `${sizeName} card should be ${expectedHeight}px high`
      );
      expect(imageRect.height).toBeLessThan(
        maxImageHeight + 1,
        `${sizeName} image should be <= ${maxImageHeight}px high`
      );
      expect(contentRect.height).toBeLessThan(
        maxContentHeight + 1,
        `${sizeName} content should be <= ${maxContentHeight}px high`
      );
      expect(actionRect.bottom).toEqual(
        cardRect.bottom,
        `${sizeName} action should be at bottom of card`
      );
    };

    it('should have small card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.small'),
        expectedHeight: 300,
        maxImageHeight: 180,
        maxContentHeight: 120,
        sizeName: 'small'
      });
    });

    it('should have medium card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.medium'),
        expectedHeight: 400,
        maxImageHeight: 240,
        maxContentHeight: 160,
        sizeName: 'medium'
      });
    });

    it('should have large card dimensions', () => {
      expectSizedCardLayout({
        card: document.querySelector('.card.large'),
        expectedHeight: 500,
        maxImageHeight: 300,
        maxContentHeight: 200,
        sizeName: 'large'
      });
    });
  });
});
