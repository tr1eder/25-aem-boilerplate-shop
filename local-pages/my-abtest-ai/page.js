// Wilson Champion's Edge – Cart and Checkout Functionality
(function(){
  const cart = [];
  const cartToggleBtn = document.getElementById('cart-toggle');
  const cartModal = document.getElementById('cart-modal');
  const cartList = document.getElementById('cart-list');
  const checkoutBtn = document.getElementById('checkout');
  const cartCloseBtn = document.getElementById('close-cart');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('close-checkout');
  const cartCountElem = document.querySelector('.cart-count');
  function updateCartDisplay() {
    cartList.innerHTML = '';
    if(cart.length === 0) {
      cartList.innerHTML = '<li>Your cart is empty.</li>';
      checkoutBtn.disabled = true;
    } else {
      cart.forEach(function(item, idx){
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>$${item.price}</span> <button aria-label='Remove ${item.name} from cart' class='remove-item' data-index='${idx}'>&times;</button>`;
        cartList.appendChild(li);
      });
      checkoutBtn.disabled = false;
    }
    cartCountElem.textContent = cart.length;
  }
  document.querySelectorAll('.add-cart').forEach(function(btn){
    btn.addEventListener('click',function(){
      cart.push({ name: btn.dataset.name, price: btn.dataset.price });
      updateCartDisplay();
      cartModal.hidden = false;
      cartModal.setAttribute('aria-hidden','false');
    });
  });
  cartToggleBtn.addEventListener('click',function(){
    cartModal.hidden = false;
    cartModal.setAttribute('aria-hidden','false');
    updateCartDisplay();
    cartCloseBtn.focus();
  });
  cartCloseBtn.addEventListener('click',function(){
    cartModal.hidden = true;
    cartModal.setAttribute('aria-hidden','true');
    cartToggleBtn.focus();
  });
  cartList.addEventListener('click',function(e){
    if(e.target.classList.contains('remove-item')){
      cart.splice(parseInt(e.target.dataset.index),1);
      updateCartDisplay();
    }
  });
  checkoutBtn.addEventListener('click',function(){
    cartModal.hidden = true;
    cartModal.setAttribute('aria-hidden','true');
    checkoutModal.hidden = false;
    checkoutModal.setAttribute('aria-hidden','false');
    checkoutCloseBtn.focus();
    cart.length = 0;
    updateCartDisplay();
  });
  checkoutCloseBtn.addEventListener('click',function(){
    checkoutModal.hidden = true;
    checkoutModal.setAttribute('aria-hidden','true');
    cartToggleBtn.focus();
  });
  document.addEventListener('keydown',function(e){
    if(!cartModal.hidden && e.key==='Escape'){
      cartModal.hidden = true; cartModal.setAttribute('aria-hidden','true'); cartToggleBtn.focus();
    }
    if(!checkoutModal.hidden && e.key==='Escape'){
      checkoutModal.hidden = true; checkoutModal.setAttribute('aria-hidden','true'); cartToggleBtn.focus();
    }
  });
})();
