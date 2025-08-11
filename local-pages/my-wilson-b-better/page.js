const products = [
  { id: 1, name: "Pro Staff 97", price: 249 },
  { id: 2, name: "Blade 98", price: 219 },
  { id: 3, name: "Clash 100", price: 199 }
];

let cart = [];

function updateCartDisplay() {
  const cartList = document.querySelector('.cart-items');
  const cartSumDiv = document.querySelector('.cart-sum');
  cartList.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
    cartSumDiv.textContent = "";
    return;
  }
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.qty}
      <span>
        $${item.price * item.qty}
        <button class="remove-link" data-id="${item.id}">&times;</button>
      </span>
    `;
    cartList.appendChild(li);
    total += item.price * item.qty;
  });
  cartSumDiv.textContent = "Total: $" + total;
  // Remove item functionality
  document.querySelectorAll('.remove-link').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      cart = cart.filter(item => item.id !== id);
      updateCartDisplay();
    });
  });
}

// Add to cart
document.querySelectorAll('.cart-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const id = parseInt(this.dataset.id);
    const product = products.find(p => p.id === id);
    const inCart = cart.find(item => item.id === id);
    if (inCart) {
      inCart.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    updateCartDisplay();
    window.location.hash = 'checkout';
  });
});

// Checkout
document.getElementById('cart-checkout-btn').addEventListener('click', function() {
  const confirmDiv = document.getElementById('cart-confirm');
  if (cart.length === 0) {
    confirmDiv.textContent = "Cart is empty. Please add a racket to checkout.";
    confirmDiv.style.color = "#d6573a";
    return;
  }
  confirmDiv.textContent = "Thanks! Your rackets are on their way!";
  confirmDiv.style.color = "#309845";
  cart = [];
  updateCartDisplay();
  setTimeout(() => {
    confirmDiv.textContent = "";
  }, 4100);
});

// Initial render
updateCartDisplay();
