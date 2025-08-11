// Product Catalogue (same as version c)
const products = [
  {
    id: 'blade',
    name: 'Blade Pro 98',
    img: 'https://assets.wilson.com/cdn-cgi/image/width=320/media/wilson/images/WR126911U_0_Blade_98_16x19_V8_Green.png',
    desc: 'Medium weight, designed for control and feel. Favored by pros.',
    price: 199,
  },
  {
    id: 'clash',
    name: 'Clash 100',
    img: 'https://assets.wilson.com/cdn-cgi/image/width=320/media/wilson/images/WR074011U_0_Clash_100_V2.png',
    desc: 'Ultimate flexibility and power. Great for intermediate to advanced.',
    price: 229,
  },
  {
    id: 'ultra',
    name: 'Ultra 100L',
    img: 'https://assets.wilson.com/cdn-cgi/image/width=320/media/wilson/images/WR043511U_0_ULTRA_100L_V3.0.png',
    desc: 'Lightweight, easy to swing and versatile. Forgiving sweet spot.',
    price: 189,
  },
  {
    id: 'prostaff',
    name: 'Pro Staff RF97',
    img: 'https://assets.wilson.com/cdn-cgi/image/width=320/media/wilson/images/WRG73161U_0_Pro_Staff_RF97_Autograph_KV.png',
    desc: 'Tour-inspired and precise. Roger Federer’s signature racket.',
    price: 249,
  }
];

// Render Product Cards
const productsList = document.getElementById('products-list');
products.forEach(prod => {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${prod.img}" alt="${prod.name}">
    <h3>${prod.name}</h3>
    <p>${prod.desc}</p>
    <div class="price">$${prod.price}</div>
    <button data-id="${prod.id}">Buy</button>
  `;
  productsList.appendChild(card);
});

// Cart Logic
let cart = JSON.parse(localStorage.getItem('wilsonCartD') || '{}');
function saveCart() { localStorage.setItem('wilsonCartD', JSON.stringify(cart)); }

function updateCartCount() {
  const count = Object.values(cart).reduce((t,c) => t+c,0);
  document.getElementById('cart-count').textContent = count;
}
updateCartCount();

productsList.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const pid = e.target.getAttribute('data-id');
    cart[pid] = (cart[pid] || 0) + 1;
    saveCart();
    updateCartCount();
    e.target.textContent = "Added!";
    setTimeout(() => {e.target.textContent = "Buy";}, 850);
  }
});

// Cart Modal Rendering
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModal = document.querySelector('.close-modal');
const checkoutMsg = document.getElementById('checkout-msg');

cartBtn.onclick = () => { renderCart(); cartModal.classList.remove('hidden'); }
closeModal.onclick = () => { cartModal.classList.add('hidden'); }
cartModal.onclick = e => { if (e.target === cartModal) cartModal.classList.add('hidden'); }

function renderCart() {
  cartItemsDiv.innerHTML = '';
  let total = 0;
  Object.entries(cart).forEach(([pid, qty]) => {
    const prod = products.find(p=>p.id===pid);
    if (!prod) return;
    total += prod.price * qty;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${prod.img}" class="cart-item-img" alt="${prod.name}">
      <div class="cart-item-title">${prod.name}</div>
      <span class="cart-item-qty">x${qty}</span>
      <button class="remove-item" data-id="${pid}" title="Remove">&times;</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
  if (total === 0) cartItemsDiv.innerHTML = '<em>Your bag is empty.</em>';
  cartTotalDiv.textContent = total ? `Total: $${total}` : '';
  checkoutMsg.textContent = '';
}

cartItemsDiv.onclick = ev => {
  if (ev.target.classList.contains('remove-item')) {
    const pid = ev.target.getAttribute('data-id');
    delete cart[pid];
    saveCart();
    updateCartCount();
    renderCart();
  }
}

checkoutBtn.onclick = () => {
  if (Object.keys(cart).length === 0) return;
  cart = {};
  saveCart();
  updateCartCount();
  renderCart();
  checkoutMsg.textContent = 'Purchase successful — Game set match!';
}

renderCart();

// Contact Form (feature: alert/acknowledge)
document.getElementById('contact-form').onsubmit = function(e){
  e.preventDefault();
  alert('Thank you for contacting our team! We’ll reply promptly.');
  this.reset();
}
