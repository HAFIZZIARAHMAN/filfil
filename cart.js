const CART_KEY = 'filfil_cart';
const WHATSAPP_NUMBER = '917997866006';
const CAFE_EMAIL = 'info@filfilcafe.com';

function parsePrice(priceStr) {
    const match = String(priceStr).match(/₹(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
}

function itemId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const Cart = {
    get() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    },

    save(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        Cart.onUpdate();
    },

    add(item) {
        const items = Cart.get();
        const id = itemId(item.name);
        const existing = items.find((i) => i.id === id);

        if (existing) {
            existing.qty += 1;
        } else {
            items.push({
                id,
                name: item.name,
                price: item.price,
                priceValue: parsePrice(item.price),
                qty: 1
            });
        }

        Cart.save(items);
    },

    setQty(id, qty) {
        const items = Cart.get();
        const item = items.find((i) => i.id === id);
        if (!item) return;

        if (qty <= 0) {
            Cart.remove(id);
            return;
        }

        item.qty = qty;
        Cart.save(items);
    },

    remove(id) {
        Cart.save(Cart.get().filter((i) => i.id !== id));
    },

    clear() {
        Cart.save([]);
    },

    count() {
        return Cart.get().reduce((sum, item) => sum + item.qty, 0);
    },

    total() {
        return Cart.get().reduce((sum, item) => sum + item.priceValue * item.qty, 0);
    },

    whatsappUrl() {
        const items = Cart.get();
        if (!items.length) {
            return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello FILFIL Café! I would like to place an order.')}`;
        }

        const lines = items.map((item) => `${item.qty}x ${item.name}`);
        const message = [
            'Hello FILFIL Café! I would like to order:',
            '',
            ...lines,
            '',
            'Thank you!'
        ].join('\n');

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    },

    onUpdate() {
        document.dispatchEvent(new CustomEvent('cart-updated'));
    }
};

function renderCartPanel() {
    const items = Cart.get();
    const listEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const emptyEl = document.getElementById('cart-empty');
    const footerEl = document.getElementById('cart-footer');
    const checkoutBtn = document.getElementById('cart-checkout');

    if (!listEl) return;

    listEl.innerHTML = '';

    if (!items.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (footerEl) footerEl.style.display = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>${item.price}</span>
            </div>
            <div class="cart-item-actions">
                <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.qty}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                <button type="button" class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Remove item">×</button>
            </div>
        `;
        listEl.appendChild(row);
    });

    if (totalEl) totalEl.textContent = `₹${Cart.total()}`;
    if (checkoutBtn) checkoutBtn.href = Cart.whatsappUrl();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = Cart.count();
}

function openCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function initCartUI() {
    updateCartBadge();
    renderCartPanel();
    updateMenuCardQuantities();

    document.getElementById('cart-toggle')?.addEventListener('click', openCart);
    document.getElementById('cart-close')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.getElementById('cart-clear')?.addEventListener('click', () => {
        Cart.clear();
    });

    document.getElementById('cart-items')?.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        const id = btn.dataset.id;
        const item = Cart.get().find((i) => i.id === id);
        if (!item) return;

        if (btn.dataset.action === 'increase') Cart.setQty(id, item.qty + 1);
        if (btn.dataset.action === 'decrease') Cart.setQty(id, item.qty - 1);
        if (btn.dataset.action === 'remove') Cart.remove(id);
    });

    document.addEventListener('cart-updated', () => {
        updateCartBadge();
        renderCartPanel();
        updateMenuCardQuantities();
    });
}

function updateMenuCardQuantities() {
    document.querySelectorAll('.flip-card[data-item-id]').forEach((card) => {
        const id = card.dataset.itemId;
        const qty = Cart.get().find((i) => i.id === id)?.qty || 0;
        const badge = card.querySelector('.item-qty-badge');
        const qtyNums = card.querySelectorAll('.card-qty-num');

        if (badge) {
            badge.textContent = qty;
            badge.hidden = qty === 0;
        }

        qtyNums.forEach((el) => {
            el.textContent = qty;
            el.hidden = qty === 0;
        });

        card.classList.toggle('in-cart', qty > 0);
    });
}

window.updateMenuCardQuantities = updateMenuCardQuantities;

window.Cart = Cart;
window.parsePrice = parsePrice;
window.itemId = itemId;
window.initCartUI = initCartUI;
window.openCart = openCart;

document.addEventListener('DOMContentLoaded', initCartUI);
