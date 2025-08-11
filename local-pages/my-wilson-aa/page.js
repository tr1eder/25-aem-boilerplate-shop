// AA - basic shop/checkout logic with smooth transitions
document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const prod = btn.getAttribute('data-product');
    const price = btn.getAttribute('data-price');
    document.querySelector('.shop-section').style.display = 'none';
    window.scrollTo({top:0,behavior:"smooth"});
    document.getElementById('checkout').style.display = 'block';
    document.getElementById('checkout-details').innerHTML = `<b>Product:</b> ${prod} <br><b>Price:</b> $${price} <br><br>`;
    document.getElementById('checkout-form').reset();
    document.getElementById('checkout-success').style.display = 'none';
  });
});
document.getElementById('checkout-form').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('checkout-form').style.display = 'none';
  document.getElementById('checkout-success').style.display = 'block';
  setTimeout(()=>{
    window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
    setTimeout(() => {
      document.getElementById('checkout').style.display = 'none';
      document.querySelector('.shop-section').style.display = 'block';
      document.getElementById('checkout-form').style.display = 'block';
      document.getElementById('checkout-success').style.display = 'none';
    }, 3600);
  }, 700);
});
