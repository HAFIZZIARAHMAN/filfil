(function () {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');
    const closeBtn = document.getElementById('nav-close');
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

    closeBtn?.addEventListener('click', () => setOpen(false));

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
