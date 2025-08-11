const RACKETS = {
    prostaff: {
        name: 'Pro Staff 97 v14',
        price: 249,
    },
    blade: {
        name: 'Blade 98 v8',
        price: 219,
    },
    clash: {
        name: 'Clash 100 v2',
        price: 199,
    },
    ultra: {
        name: 'Ultra 100 v4',
        price: 179,
    }
};

// Cart logic
let cart = {};

function openCart() {
    document.getElementById('cart-modal').style.display = 'flex';
    renderCart();
}
function closeModals() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'none';
}
function renderCart() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let total = 0;
    Object.keys(cart).forEach(id => {
        const count = cart[id];
        const racket = RACKETS[id];
        if (count > 0) {
            let row = document.createElement('div');
            row.className = 'item-row';
            row.textContent = `${racket.name} × ${count}`;
            itemsDiv.appendChild(row);
            total += racket.price * count;
        }
    });
    document.getElementById('cart-total').textContent = total > 0 ? `Total: $${total}.00` : '';
}

function buy(id) {
    cart[id] = (cart[id] || 0) + 1;
    openCart();
}

Array.from(document.getElementsByClassName('buy-btn')).forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('[data-id]');
        const id = card.dataset.id;
        buy(id);
    });
});
document.getElementsByClassName('close-cart')[0].onclick = closeModals;
document.getElementsByClassName('close-cart')[1].onclick = closeModals;

document.getElementById('checkout-btn').onclick = function() {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'flex';
};

// Checkout form
document.getElementById('checkout-form').onsubmit = function(e) {
    e.preventDefault();
    alert('Order received! This is only a demo checkout.');
    cart = {};
    renderCart();
    closeModals();
};

window.onclick = function(event) {
    if (event.target.classList.contains('cart-modal')) {
        closeModals();
    }
};