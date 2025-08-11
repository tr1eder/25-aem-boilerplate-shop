// AB - similar logic for dark theme, with selectors adjusted
document.querySelectorAll('.buy-btn-ab').forEach(btn => {
  btn.addEventListener('click', function () {
    const prod = btn.getAttribute('data-product');
    const price = btn.getAttribute('data-price');
    document.querySelector('.shop-section-ab').style.display = 'none';
    window.scrollTo({top:0,behavior:"smooth"});
    document.getElementById('checkout-ab').style.display = 'block';
    document.getElementById('checkout-ab-details').innerHTML = `<b>Product:</b> ${prod} <br><b>Price:</b> $${price} <br><br>`;
    document.getElementById('checkout-ab-form').reset();
    document.getElementById('checkout-ab-success').style.display = 'none';
  });
});
document.getElementById('checkout-ab-form').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('checkout-ab-form').style.display = 'none';
  document.getElementById('checkout-ab-success').style.display = 'block';
  setTimeout(()=>{
    window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"});
    setTimeout(() => {
      document.getElementById('checkout-ab').style.display = 'none';
      document.querySelector('.shop-section-ab').style.display = 'block';
      document.getElementById('checkout-ab-form').style.display = 'block';
      document.getElementById('checkout-ab-success').style.display = 'none';
    }, 3300);
  }, 800);
});
