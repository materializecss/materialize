export class Cards {

  static Init() {
    if (typeof document !== 'undefined') document.addEventListener("DOMContentLoaded", () => {
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
          const duration = 225;
          cardReveal.style.transition = `transform ${duration}ms ease`; //easeInOutQuad
          cardReveal.style.transform = 'translateY(0)';            
          setTimeout(() => {
            cardReveal.style.display = 'none';
            card.style.overflow = initialOverflow;
          }, duration);
        };

        // Reveal Card
        const activators = card.querySelectorAll('.activator');
        activators.forEach(activator => {
          if (trigger === activator || activator.contains(trigger)) {
            card.style.overflow = 'hidden';
            cardReveal.style.display = 'block';
            setTimeout(() => {
              const duration = 300;
              cardReveal.style.transition = `transform ${duration}ms ease`; //easeInOutQuad
              cardReveal.style.transform = 'translateY(-100%)';              
            }, 1);
          }
        });

      });
    });

  }
}
