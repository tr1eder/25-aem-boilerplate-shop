// Vanilla JS for shop+checkout flow

const buyButtons = document.querySelectorAll('.buy-btn');
const checkoutSection = document.getElementById('checkout-section');
const shopSection = document.querySelector('.shop');
const selectedProductDiv = document.querySelector('.selected-product');
const cancelBtn = document.querySelector('.cancel-btn');
const checkoutForm = document.getElementById('checkout-form');
const confirmationMsg = document.querySelector('.confirmation-message');

let selectedProduct = {};

buyButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    selectedProduct = {
      title: card.querySelector('h3').textContent,
      price: card.querySelector('.price').textContent,
      details: card.querySelector('.details').innerHTML,
      imgSrc: card.querySelector('img').src,
      imgAlt: card.querySelector('img').alt
    };
    showCheckout();
  });
});

function showCheckout() {
  shopSection.style.display = 'none';
  checkoutSection.style.display = 'block';
  confirmationMsg.style.display = 'none';
  selectedProductDiv.innerHTML = `
    <strong>${selectedProduct.title}</strong>
    <div style="margin: 0.6em 0;">
      <img src="${selectedProduct.imgSrc}" alt="${selectedProduct.imgAlt}" style="height:60px; border-radius:4px;">
    </div>
    <div style="color:#666;font-size:1em;margin-bottom:0.3em;">${selectedProduct.price}</div>
    <div style="font-size:0.98em;">${selectedProduct.details}</div>
  `;
}

cancelBtn.addEventListener('click', () => {
  checkoutSection.style.display = 'none';
  shopSection.style.display = 'block';
});

checkoutForm.addEventListener('submit', e => {
  e.preventDefault();
  checkoutForm.style.display = 'none';
  selectedProductDiv.style.display = 'none';
  confirmationMsg.style.display = 'block';
  setTimeout(() => {
    checkoutForm.reset();
    confirmationMsg.style.display = 'none';
    selectedProductDiv.style.display = '';
    checkoutForm.style.display = '';
    checkoutSection.style.display = 'none';
    shopSection.style.display = 'block';
  }, 2200);
});
