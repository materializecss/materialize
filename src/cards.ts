import anim from "animejs";

export class Cards {

  static Init() {

    document.addEventListener("DOMContentLoaded", () => {
      document.body.addEventListener('click', e => {
        const trigger = <HTMLElement>e.target;

        const card: HTMLElement = trigger.closest('.card');
        if (!card) return;

        const cardReveal = <HTMLElement|null>Array.from(card.children).find(elem => elem.classList.contains('card-reveal'));
        if (!cardReveal) return;
        const initialOverflow = getComputedStyle(card).overflow;

        // Close Card
        const closeArea = cardReveal.querySelector('.card-reveal .card-title');
        if (trigger === closeArea || closeArea.contains(trigger)) {
          anim({
            targets: cardReveal,
            translateY: 0,
            duration: 225,
            easing: 'easeInOutQuad',
            complete: (anim) => {
              cardReveal.style.display = 'none';
              card.style.overflow = initialOverflow;
            }
          });
        };

        // Reveal Card
        const activators = card.querySelectorAll('.activator');
        activators.forEach(activator => {
          if (trigger === activator || activator.contains(trigger)) {
            card.style.overflow = 'hidden';
            cardReveal.style.display = 'block';
            anim({
              targets: cardReveal,
              translateY: '-100%',
              duration: 300,
              easing: 'easeInOutQuad'
            });
          }
        });


      });
    });

  }
}
