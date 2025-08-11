const products = {
  'pro-staff-97': {
    name: 'Wilson Pro Staff 97',
    price: 259,
  },
  'clash-100': {
    name: 'Wilson Clash 100',
    price: 249,
  },
};
const cartBtn = document.querySelector('.cart__toggle');
const cartDropdown = document.querySelector('.cart__dropdown');
const cartList = document.querySelector('.cart__list');
const cartTotal = document.querySelector('.cart__total-value');
const cartCheckout = document.querySelector('.cart__checkout');
const modal = document.getElementById('checkout-modal');
const modalClose = document.querySelector('.modal__close');
let cart = {};

function updateCartDisplay() {
  cartList.innerHTML = '';
  let total = 0;
  Object.keys(cart).forEach(pid => {
    const item = products[pid];
    const qty = cart[pid];
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><span>x${qty} <button aria-label='Remove from cart' data-remove="${pid}" class='remove-btn' style='background:none;border:none;color:#e41e26;font-size:1.1em;cursor:pointer;'>&times;</button></span>`;
    cartList.appendChild(li);
    total += item.price * qty;
  });
  cartTotal.textContent = `$${total}`;
  if (!Object.keys(cart).length) {
    cartList.innerHTML = '<li><em>Your cart is empty.</em></li>';
    cartCheckout.setAttribute('disabled', 'true');
  } else {
    cartCheckout.removeAttribute('disabled');
  }
}

document.querySelectorAll('.shop__cta').forEach(btn => {
  btn.addEventListener('click', e => {
    const pid = btn.getAttribute('data-product');
    cart[pid] = (cart[pid] || 0) + 1;
    updateCartDisplay();
    cartDropdown.hidden = false;
    cartBtn.setAttribute('aria-expanded','true');
  });
});

cartBtn.addEventListener('click', e => {
  const expanded = cartDropdown.hidden === false;
  cartDropdown.hidden = expanded;
  cartBtn.setAttribute('aria-expanded', !expanded);
  if (!cartDropdown.hidden) {
    updateCartDisplay();
    cartDropdown.querySelector('button, [tabindex]')?.focus();
  }
});

document.addEventListener('click', e => {
  if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
    cartDropdown.hidden = true;
    cartBtn.setAttribute('aria-expanded','false');
  }
});

cartList.addEventListener('click', e => {
  if (e.target.matches('[data-remove]')) {
    const pid = e.target.getAttribute('data-remove');
    if (--cart[pid] <= 0) delete cart[pid];
    updateCartDisplay();
  }
});

cartCheckout.addEventListener('click', e => {
  if (Object.keys(cart).length) {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
});
modalClose.addEventListener('click', () => {
  modal.hidden = true;
  document.body.style.overflow = '';
  cart = {};
  updateCartDisplay();
  cartDropdown.hidden = true;
  cartBtn.focus();
});
modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
    cart = {};
    updateCartDisplay();
  }
});
window.addEventListener('keydown', e => {
  if (!modal.hidden && (e.key === 'Escape')) {
    modalClose.click();
  }
});

updateCartDisplay();
