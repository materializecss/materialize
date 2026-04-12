describe('Fab Plugin:', () => {
  const fixture = `<div class="fixed-action-btn">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn horizontal">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>

<div class="fixed-action-btn click-to-toggle">
  <a class="btn-floating btn-large red">
    <i class="large material-icons">mode_edit</i>
  </a>
  <ul>
    <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    <li><a class="btn-floating yellow darken-1"><i class="material-icons">format_quote</i></a></li>
    <li><a class="btn-floating green"><i class="material-icons">publish</i></a></li>
    <li><a class="btn-floating blue"><i class="material-icons">attach_file</i></a></li>
  </ul>
</div>
`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Floating Action Button', () => {
    it('should open correctly', (done) => {
      const normalFAB = document.querySelector('.fixed-action-btn');
      M.FloatingActionButton.init(normalFAB);
      const ul = normalFAB.querySelector('ul');
      const ulStyle = getComputedStyle(ul);
      expect(ulStyle.getPropertyValue('visibility')).toEqual(
        'hidden',
        'FAB menu div should be hidden initially'
      );
      setTimeout(() => {
        mouseenter(normalFAB);
        setTimeout(() => {
          const ulStyle = getComputedStyle(ul);
          expect(ulStyle.getPropertyValue('visibility')).toEqual(
            'visible',
            'FAB menu did not appear after mouseenter.'
          );
          done();
        }, 400);
      }, 100);
    });
  });
});
