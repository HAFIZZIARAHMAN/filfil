(function () {
    // Navbar: transparent over the hero, solid cream once scrolled.
    const nav = document.querySelector('.site-nav');
    if (nav) {
        const hero = document.querySelector('.hero');
        const threshold = 40;

        const updateNav = () => {
            // Pages without a hero (e.g. menu) always use the solid cream navbar.
            const solid = !hero || window.scrollY > threshold;
            nav.classList.toggle('scrolled', solid);
        };

        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });
        window.addEventListener('resize', updateNav);
    }
})();

(function () {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    const cartToggle = document.getElementById('cart-toggle');

    if (!burger || !menu) return;

    function setOpen(open) {
        burger.classList.toggle('open', open);
        menu.classList.toggle('open', open);
        overlay?.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.classList.toggle('nav-open', open);
    }

    setOpen(false);

    burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));

    overlay?.addEventListener('click', () => setOpen(false));

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    cartToggle?.addEventListener('click', () => {
        if (menu.classList.contains('open')) setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
    });
})();

(function () {
    // Scrollspy: highlight the nav link for the section currently in view.
    const links = Array.from(document.querySelectorAll('.site-nav ul a[href^="#"]'));
    if (links.length && 'IntersectionObserver' in window) {
        const entries = links
            .map((a) => ({ a, section: document.getElementById(a.getAttribute('href').slice(1)) }))
            .filter((x) => x.section);

        if (entries.length) {
            let current = null;
            const setActive = (id) => {
                if (id === current) return;
                current = id;
                entries.forEach(({ a, section }) => {
                    const on = section.id === id;
                    a.classList.toggle('active', on);
                    if (on) a.setAttribute('aria-current', 'true');
                    else a.removeAttribute('aria-current');
                });
            };

            const observer = new IntersectionObserver((obsEntries) => {
                const visible = obsEntries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) setActive(visible[0].target.id);
            }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] });

            entries.forEach(({ section }) => observer.observe(section));
        }
    }
})();

(function () {
    const skipLazy = (img) => img.closest('.site-nav') || img.closest('.hero');

    document.querySelectorAll('img:not([loading])').forEach((img) => {
        if (!skipLazy(img)) img.loading = 'lazy';
        if (!img.hasAttribute('decoding')) img.decoding = 'async';
    });

    document.querySelectorAll('iframe:not([loading])').forEach((frame) => {
        if (!frame.closest('.hero')) frame.loading = 'lazy';
    });
})();
