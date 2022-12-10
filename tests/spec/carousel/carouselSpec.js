describe("Carousel", () => {

  beforeEach(async () => {
    await XloadFixtures(['carousel/carouselFixture.html']);
  });

  afterEach(() => {
    XunloadFixtures();
  });

  describe("carousel plugin", () => {

    it("No wrap next and prev should not overflow", (done) => {
      let noWrap = M.Carousel.init(
        document.querySelector("#slider-no-wrap"), { noWrap: true }
      );
      noWrap.prev();

      expect(noWrap.center).toEqual(0, "Prev should do nothing");

      noWrap.set(3);
      setTimeout(() => {
        noWrap.next();

        setTimeout(() => {
          expect(noWrap.center).toEqual(3, "Next should do nothing");
          noWrap.destroy();

          done();
        }, 400);
      }, 400);
    });

    it("Label of indicators must start with 'Slide '", () => {
      let carousel = M.Carousel.init(
        document.querySelector("#slider-no-wrap"), {
          indicators: true,
          indicatorLabelFunc: (idx) => "Slide " + idx
        }
      );

      expect(Array.from(document.querySelectorAll("button")).map((btn) =>
        btn.getAttribute("aria-label").startsWith("Slide ")
      )).toEqual([true, true, true, true]);
      carousel.destroy();
    });

    it("Non-current slides must be hidden (fullWidth)", (done) => {
      let carousel = M.Carousel.init(document.querySelector("#slider-no-wrap"), { fullWidth: true });

      setTimeout(() => {
        expect(Array.from(document.querySelectorAll(".carousel-item")).map((item) => item.style.visibility))
          .toEqual(["visible", "", "", ""]);
        expect(Array.from(document.querySelectorAll(".carousel-item")).map((item) => item.getAttribute("aria-hidden")))
          .toEqual(["false", "true", "true", "true"]);
        carousel.destroy();
        done();
      }, 400);
    });

  });

});
