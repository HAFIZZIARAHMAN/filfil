(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const selectors = [
        '.section-title',
        '.card',
        '.menu-item',
        '.review',
        '.gallery img',
        '.about',
        '.contact-box',
        '.detailed-menu-btn',
        '.page-header',
        '.menu-buttons'
    ];

    const applyReveal = () => {
        const targets = document.querySelectorAll(selectors.join(','));
        if (!targets.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            targets.forEach((el) => el.classList.add('reveal-in'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        targets.forEach((el) => {
            if (el.classList.contains('reveal')) return;
            el.classList.add('reveal');

            // Stagger elements that share a parent for an elegant cascade.
            const siblings = el.parentElement
                ? Array.from(el.parentElement.children).filter((c) => c.matches(selectors.join(',')))
                : [];
            const index = Math.max(0, siblings.indexOf(el));
            el.style.transitionDelay = Math.min(index * 90, 450) + 'ms';

            observer.observe(el);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyReveal);
    } else {
        applyReveal();
    }

    // Menu cards are generated after load; expose a hook so pages can re-scan.
    window.refreshReveal = applyReveal;
})();
