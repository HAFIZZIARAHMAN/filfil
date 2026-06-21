(function () {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');

    if (!burger || !menu) return;

    function setOpen(open) {
        burger.classList.toggle('open', open);
        menu.classList.toggle('open', open);
        overlay?.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-open', open);
    }

    burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));

    overlay?.addEventListener('click', () => setOpen(false));

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setOpen(false);
    });
})();
