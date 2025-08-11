const shopItems = [
  {
    id: 'blade-98',
    name: 'Wilson Ultra 100',
    price: 239.00
  },
  {
    id: 'ultra-100',
    name: 'Wilson Blade 98',
    price: 249.00
  }
];

let cart = [];

function updateCartCount() {
  document.querySelector('.cart__count').textContent = cart.length;
}
function renderCartItems() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  if (cart.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Your cart is empty.';
    list.appendChild(li);
    return;
  }
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} <span style='color:#E31937'>$${item.price.toFixed(2)}</span> <button type='button' aria-label='Remove ${item.name} from cart' class='cart__remove' data-id='${item.id}'>Remove</button>`;
    list.appendChild(li);
  });
}
function showCartModal(show) {
  const modal = document.querySelector('.cart__modal');
  modal.setAttribute('aria-hidden', show ? 'false' : 'true');
  if (show) {
    modal.querySelector('.cart__close').focus();
  } else {
    document.querySelector('.cart__toggle').focus();
    modal.querySelector('.cart__confirmation').hidden = true;
  }
}
document.querySelectorAll('.shop__add-cart').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    cart.push(shopItems[idx]);
    updateCartCount();
    renderCartItems();
    showCartModal(true);
  });
});
document.querySelector('.cart__toggle').addEventListener('click', () => {
  showCartModal(true);
  renderCartItems();
});
document.querySelector('.cart__close').addEventListener('click', () => {
  showCartModal(false);
});
document.querySelector('.cart__modal').addEventListener('click', function(e) {
  if (e.target.classList.contains('cart__remove')) {
    const id = e.target.getAttribute('data-id');
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    renderCartItems();
  }
});
document.querySelector('.cart__checkout').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }
  document.querySelector('.cart__confirmation').hidden = false;
  cart = [];
  updateCartCount();
  renderCartItems();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    showCartModal(false);
  }
});
