const products = [
  {
    id: 1,
    name: "Pro Staff 97",
    price: 249,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Blade 98",
    price: 219,
    image: "https://images.unsplash.com/photo-1485841890310-6a055c88698a?fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Clash 100",
    price: 199,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=400&q=80"
  }
];

let cart = [];

function renderCart() {
  const cartList = document.querySelector('.cart-list');
  const cartTotalDiv = document.querySelector('.cart-total');
  cartList.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    cartList.innerHTML = "<li>Your cart is empty.</li>";
    cartTotalDiv.textContent = "";
    return;
  }
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x${item.qty}
      <span>
        $${item.price * item.qty}
        <button class="remove-btn" data-id="${item.id}">&times;</button>
      </span>
    `;
    cartList.appendChild(li);
    total += item.price * item.qty;
  });
  cartTotalDiv.textContent = 'Total: $' + total;
  // Remove functionality
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      let id = parseInt(this.dataset.id);
      cart = cart.filter(item => item.id !== id);
      renderCart();
    });
  });
}

// Add to cart
document.querySelectorAll('.add-cart-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const id = parseInt(btn.dataset.id);
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    renderCart();
    window.location.hash = "checkout";
  });
});

// Checkout
document.getElementById('checkout-btn').addEventListener('click', function() {
  const msgDiv = document.getElementById('checkout-message');
  if (cart.length === 0) {
    msgDiv.textContent = "Your cart is empty. Please add something to checkout.";
    msgDiv.style.color = "#e6382f";
    return;
  }
  msgDiv.textContent = "Thank you for your purchase! Your rackets will be shipped soon.";
  cart = [];
  renderCart();
  setTimeout(() => {
    msgDiv.textContent = "";
  }, 4100);
});

// Initial render
renderCart();
