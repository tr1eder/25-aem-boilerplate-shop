// Wilson Tennis ABTest-L JS
// Accessibility: Smooth scroll for anchor links, focus management

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.setAttribute('tabindex', '-1');
        targetEl.focus();
        setTimeout(function () { targetEl.removeAttribute('tabindex'); }, 1000);
      }
    });
  });
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('focus', function () {
      btn.classList.add('focus-visible');
    });
    btn.addEventListener('blur', function () {
      btn.classList.remove('focus-visible');
    });
  });
});
