// Minimal vanilla JS for modal checkout flow

const buyBtns = document.querySelectorAll('.buy');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutSummary = document.querySelector('.checkout-summary');
const modalForm = document.getElementById('modal-form');
const orderDone = document.querySelector('.order-done');
const closeBtn = document.getElementById('close-modal');
const cartIcon = document.getElementById('cart-indicator');

let selected = null;

buyBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const prod = btn.closest('.product');
    selected = {
      title: prod.querySelector('h2').textContent,
      price: prod.querySelector('.prod-price').textContent,
      img: prod.querySelector('img').src,
      info: prod.querySelector('p').innerHTML
    };
    showModal();
  });
});

cartIcon.addEventListener('click', () => {
  // Just focus modal on any preselected, else default to first
  if (!selected) {
    const prod = document.querySelector('.product');
    selected = {
      title: prod.querySelector('h2').textContent,
      price: prod.querySelector('.prod-price').textContent,
      img: prod.querySelector('img').src,
      info: prod.querySelector('p').innerHTML
    };
  }
  showModal();
});

function showModal() {
  checkoutSummary.innerHTML = `
    <strong style="font-size:1.05em">${selected.title}</strong>
    <div style="margin:0.45em 0;">
      <img src="${selected.img}" style="height:48px;border-radius:4px;">
    </div>
    <div style="color:#05aff2;font-weight:600;margin-bottom:0.13em;">${selected.price}</div>
    <div style="font-size:0.97em;">${selected.info}</div>
  `;
  orderDone.style.display = 'none';
  modalForm.style.display = '';
  checkoutModal.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
  checkoutModal.style.display = 'none';
});

checkoutModal.addEventListener('click', (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.style.display = 'none';
  }
});

modalForm.addEventListener('submit', e => {
  e.preventDefault();
  modalForm.style.display = 'none';
  orderDone.style.display = 'block';
  setTimeout(() => {
    // Reset modal for next order
    orderDone.style.display = 'none';
    modalForm.reset();
    modalForm.style.display = '';
    checkoutModal.style.display = 'none';
  }, 2000);
});
