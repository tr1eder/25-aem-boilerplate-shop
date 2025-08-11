// Wilson Rackets Shop Data
const products = [
  {
    name: "Pro Staff RF97",
    desc: "Federer-inspired precision and classic feel. Perfect for advanced players.",
    price: 289.00,
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Blade 98 V8",
    desc: "Modern control and versatility. Dynamic flex for hard hitters and all-court games.",
    price: 249.00,
    img: "https://images.unsplash.com/photo-1526178613658-3a56e64c8a4f?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Clash 100",
    desc: "Ultimate flex and comfort with exceptional power. For modern, aggressive swings.",
    price: 259.00,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Ultra 100 V3",
    desc: "Explosive power and effortless speed. Designed for dominating the baseline.",
    price: 229.00,
    img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=400&q=80"
  }
];

// Render products
const productList = document.getElementById('product-list');
products.forEach((product, idx) => {
  const pCard = document.createElement('div');
  pCard.className = 'product-card';
  pCard.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.desc}</p>
    <div class="price">$${product.price.toFixed(2)}</div>
    <button data-idx="${idx}">Add to Cart</button>
  `;
  productList.appendChild(pCard);
});
productList.addEventListener('click', function(e) {
  if (e.target.tagName === "BUTTON") {
    const idx = +e.target.dataset.idx;
    addToCart(idx);
  }
});

// Cart Functionality
let cart = [];
let cartOpen = false;

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((a, item) => a + item.qty, 0);
}
function renderCart() {
  const cItems = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  cItems.innerHTML = '';
  let t = 0;
  cart.forEach((item, i) => {
    t += item.qty * item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-qty">${item.qty}x</span>
      <span>$${(item.qty * item.price).toFixed(2)}</span>
      <button onclick="removeCartItem(${i})">Remove</button>
    `;
    cItems.appendChild(li);
  });
  total.textContent = cart.length ? `Total: $${t.toFixed(2)}` : '';
}
function addToCart(idx) {
  const prod = products[idx];
  const found = cart.find(item => item.name === prod.name);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ name: prod.name, price: prod.price, qty: 1 });
  }
  updateCartCount();
  renderCart();
}
// Remove item globally
window.removeCartItem = function(i) {
  cart.splice(i, 1);
  updateCartCount();
  renderCart();
};

const cartModal = document.getElementById('cart-modal');
document.getElementById('cart-btn').onclick = function() {
  cartModal.classList.remove('hidden');
  cartOpen = true;
  renderCart();
};
document.getElementById('close-cart').onclick = function() {
  cartModal.classList.add('hidden');
  cartOpen = false;
};
// Close modal on background click
cartModal.onclick = function(e) {
  if (e.target === cartModal) {
    cartModal.classList.add('hidden');
    cartOpen = false;
  }
};

// Checkout
document.getElementById('checkout-btn').onclick = function() {
  if (cart.length === 0) return;
  cart = [];
  updateCartCount();
  renderCart();
  document.getElementById('checkout-success').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('checkout-success').classList.add('hidden');
    cartModal.classList.add('hidden');
    cartOpen = false;
  }, 1700);
};

// Initialize
updateCartCount();