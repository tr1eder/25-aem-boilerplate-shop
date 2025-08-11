const cartState = {
  racquet_ball: 0,
  hat: 0,
};

function updateCartCount() {
  const count = cartState.racquet_ball + cartState.hat;
  document.getElementById('cart-count').textContent = count;
}

function showConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.hidden = false;
  modal.querySelector('button').focus();
}

function hideConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.hidden = true;
  // Return focus to the first add-to-cart button for accessibility
  const btn = document.querySelector('.js-add-to-cart');
  if (btn) btn.focus();
}

document.querySelectorAll('.js-add-to-cart').forEach((btn) => {
  btn.addEventListener('click', () => {
    const product = btn.getAttribute('data-product');
    cartState[product]++;
    updateCartCount();
    showConfirmationModal();
  });
});

document.getElementById('close-modal').addEventListener('click', hideConfirmationModal);
// Close modal on background click or Esc
document.getElementById('confirmation-modal').addEventListener('click', function (e) {
  if (e.target === this) hideConfirmationModal();
});
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('confirmation-modal').hidden && e.key === 'Escape') {
    hideConfirmationModal();
  }
});
// Cart bar click: simple summary/alert
document.querySelector('.cart-bar__btn').addEventListener('click', () => {
  alert(`In Cart:
Racquet & Ball: ${cartState.racquet_ball}
Hat: ${cartState.hat}`);
});
