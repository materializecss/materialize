describe('Cards', () => {
  const fixture = `<div class="row">
  <div class="col s12 m6">
    <div class="card reveal">
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
    </div>
    <div class="card-content">
      <span class="card-title activator grey-text text-darken-4">Card Title<i class="material-icons right">more_vert</i></span>
      <p><a href="#">This is a link</a></p>
    </div>
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
      <p>Here is some more information about this product that is only revealed once clicked on.</p>
    </div>
  </div>

  <div class="col s12 m6">
    <div class="card image">
      <div class="card-image">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
        <span class="card-title">Card Title</span>
      </div>
      <div class="card-content">
        <p>I am a very simple card. I am good at containing small bits of information.
        I am convenient because I require little markup to use effectively.</p>
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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
        <span class="card-title">Card Title</span>
      </div>
      <div class="card-content">
        <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
        <span class="card-title">Card Title</span>
      </div>
      <div class="card-content">
        <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
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
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
        <span class="card-title">Card Title</span>
      </div>
      <div class="card-content">
        <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
      </div>
      <div class="card-action">
        <a href="#">This is a link</a>
        <a href="#">This is a link</a>
      </div>
    </div>
  </div>
</div>
`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('reveal cards', () => {
    let revealCard;

    beforeEach(() => {
      revealCard = document.querySelector('.card.reveal');
      M.Cards.init(document.querySelectorAll('.card'));
    });

    it('should have a hidden card-reveal', (done) => {
      const revealDiv = revealCard.querySelector('.card-reveal');
      const activator = revealCard.querySelector('.activator');
      expect(revealDiv).toBeHidden('reveal div should be hidden initially');
      click(activator);
      setTimeout(() => {
        expect(revealDiv).toBeVisible('reveal did not appear after activator was clicked.');
        // Check revealDiv covers reveal card.
        const revealDivPos = revealDiv.getBoundingClientRect();
        const revealCardPos = revealCard.getBoundingClientRect();
        expect(revealDivPos.width).toEqual(
          revealCardPos.width,
          'activator not as wide as reveal card.'
        );
        expect(revealDivPos.height).toEqual(
          revealCardPos.height,
          'activator not as high as reveal card.'
        );
        expect(revealDivPos.top).toEqual(
          revealCardPos.top,
          'activator not as in the same y as reveal card.'
        );
        expect(revealDivPos.left).toEqual(
          revealCardPos.left,
          'activator not as in the same x as reveal card.'
        );
        done();
      }, 500);
    });
  });

  describe('image cards', () => {
    let imageCard;
    beforeEach(() => {
      imageCard = document.querySelector('.card.image');
    });

    it('should have an image that fills to full width of card', () => {
      const image = imageCard.querySelector('.card-image > img');
      const imagePositions = image.getBoundingClientRect();
      const imageCardPos = imageCard.getBoundingClientRect();
      expect(imagePositions.width).toEqual(imageCardPos.width, 'image does not fill width of card');
      expect(imagePositions.top).toEqual(imageCardPos.top, 'image not as in the same y as card.');
    });
  });

  describe('sized cards', () => {
    let small, medium, large;

    beforeEach(() => {
      small = document.querySelector('.card.small');
      medium = document.querySelector('.card.medium');
      large = document.querySelector('.card.large');
    });

    it('should have small card dimensions', () => {
      const cardImage = small.querySelector('.card-image');
      const cardContent = small.querySelector('.card-content');
      const cardAction = small.querySelector('.card-action');
      const smallRect = small.getBoundingClientRect();
      const cardImageRect = cardImage.getBoundingClientRect();
      const cardContentRect = cardContent.getBoundingClientRect();
      const cardActionRect = cardAction.getBoundingClientRect();

      expect(smallRect.height).toEqual(300, 'small card should be 300px high');
      expect(cardImageRect.height).toBeLessThan(181, 'small image should be <= 180px or 60% high');
      expect(cardContentRect.height).toBeLessThan(
        121,
        'small content should be <= 120px or 40% high'
      );
      expect(cardActionRect.top + cardActionRect.height).toEqual(
        smallRect.top + smallRect.height,
        'small action should be at bottom of card'
      );
    });

    it('should have medium card dimensions', () => {
      const cardImage = medium.querySelector('.card-image');
      const cardContent = medium.querySelector('.card-content');
      const cardAction = medium.querySelector('.card-action');
      const mediumRect = medium.getBoundingClientRect();
      const cardImageRect = cardImage.getBoundingClientRect();
      const cardContentRect = cardContent.getBoundingClientRect();
      const cardActionRect = cardAction.getBoundingClientRect();

      expect(mediumRect.height).toEqual(400, 'medium card should be 400px high');
      expect(cardImageRect.height).toBeLessThan(241, 'medium image should be <= 240 or 60% high');
      expect(cardContentRect.height).toBeLessThan(
        161,
        'medium content should be <= 160px or 40% high'
      );
      expect(cardActionRect.top + cardActionRect.height).toEqual(
        mediumRect.top + mediumRect.height,
        'medium action should be at bottom of card'
      );
    });

    it('should have large card dimensions', () => {
      const cardImage = large.querySelector('.card-image');
      const cardContent = large.querySelector('.card-content');
      const cardAction = large.querySelector('.card-action');
      const largeRect = large.getBoundingClientRect();
      const cardImageRect = cardImage.getBoundingClientRect();
      const cardContentRect = cardContent.getBoundingClientRect();
      const cardActionRect = cardAction.getBoundingClientRect();

      expect(largeRect.height).toEqual(500, 'large card should be 500px high');
      expect(cardImageRect.height).toBeLessThan(301, 'large image should be <= 300 or 60% high');
      expect(cardContentRect.height).toBeLessThan(
        201,
        'large content should be <= 200 or 40% high'
      );
      expect(cardActionRect.top + cardActionRect.height).toEqual(
        largeRect.top + largeRect.height,
        'large action should be at bottom of card'
      );
    });
  });
});
