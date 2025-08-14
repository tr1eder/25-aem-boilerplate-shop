// Shopping cart logic
const cartIcon = document.querySelector('.cart-icon');
const cartFlyout = document.getElementById('cart-flyout');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const confirmationDiv = document.getElementById('confirmation');
const closeCartBtn = document.querySelector('.close-cart');

let cart = {};

function updateCartCount() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  cartCount.textContent = count;
}

function renderCartItems() {
  cartItemsList.innerHTML = '';
  let total = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const name = id === 'staff' ? 'Pro Staff Elite' : 'Ultra Power';
    const price = id === 'staff' ? 229 : 199;
    const item = document.createElement('li');
    item.innerHTML = `<span>${name}</span> <span>×${qty}</span> <span>$${(price * qty).toFixed(0)}</span>`;
    cartItemsList.appendChild(item);
    total += price * qty;
  });
  if (total > 0) {
    const tot = document.createElement('li');
    tot.innerHTML = `<strong>Total</strong> <strong></strong> <strong>$${total}</strong>`;
    cartItemsList.appendChild(tot);
  }
}

function showCart() {
  cartFlyout.classList.add('open');
  renderCartItems();
}
function hideCart() {
  cartFlyout.classList.remove('open');
  confirmationDiv.textContent = '';
}
cartIcon.addEventListener('click', () => {
  showCart();
});
closeCartBtn.addEventListener('click', hideCart);

const addBtns = document.querySelectorAll('.add-to-cart');
addBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const pid = btn.dataset.productId;
    cart[pid] = (cart[pid] || 0) + 1;
    updateCartCount();
    showCart();
    renderCartItems();
    confirmationDiv.textContent = '';
  });
});

cartFlyout.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideCart();
});

checkoutBtn.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    confirmationDiv.textContent = 'No items in cart.';
    return;
  }
  confirmationDiv.textContent = 'This is a mockup website, thank you for your participation.';
  cart = {};
  renderCartItems();
  updateCartCount();
});

// Quick view on hover desktop/cart icon
cartIcon.addEventListener('mouseenter', () => {
  if (window.innerWidth > 800 && Object.keys(cart).length) showCart();
});
cartIcon.addEventListener('mouseleave', () => {
  if (window.innerWidth > 800) hideCart();
});

updateCartCount();
