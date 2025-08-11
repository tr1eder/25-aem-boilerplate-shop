// Rotating testimonials
const testimonials = [
  {
    quote: "DreamSite gave our brand instant credibility. Set up literally took minutes and customers noticed right away.",
    name: "Alex Chen, Founder, LunaTea"
  },
  {
    quote: "The template selection was impressive; I picked a design, described my business, and the AI took care of everything else.",
    name: "Morgan Smith, Freelance Designer"
  },
  {
    quote: "Seamless integrations made it so easy to add ecommerce and schedule bookings. Support team was amazing.",
    name: "Priya Patel, Small Business Owner"
  }
];

let testimonialIdx = 0;
function showTestimonial(idx) {
  const rotator = document.getElementById('testimonial-rotator');
  const t = testimonials[idx];
  rotator.innerHTML = `<span>“${t.quote}”</span> <br><b>- ${t.name}</b>`;
}

// Initial display and interval rotation
showTestimonial(testimonialIdx);
setInterval(() => {
  testimonialIdx = (testimonialIdx + 1) % testimonials.length;
  showTestimonial(testimonialIdx);
}, 4800);

// Template carousel logic
const templates = [
  {
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    alt: "Modern workspace template",
    name: "Modern Workspace"
  },
  {
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    alt: "Minimal Business",
    name: "Minimal Business"
  },
  {
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    alt: "Creative Team",
    name: "Creative Team"
  },
  {
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    alt: "Freelance Portfolio",
    name: "Freelance Portfolio"
  },
  {
    img: "https://images.unsplash.com/photo-1465101178521-c1a8889a96c9",
    alt: "Startup Solution",
    name: "Startup Solution"
  },
  {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Ecommerce Store",
    name: "Ecommerce Store"
  }
];

const viewport = document.querySelector('.carousel-viewport');
let carouselPos = 0;

function renderTemplates() {
  viewport.innerHTML = '';
  templates.forEach((tpl, idx) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `<img src="${tpl.img}" alt="${tpl.alt}"><h3>${tpl.name}</h3>`;
    card.onclick = () => alert(`Preview ${tpl.name} template`);
    viewport.appendChild(card);
  });
}

document.querySelector('.carousel-btn.next').onclick = () => {
  if (carouselPos < templates.length - 3) {
    carouselPos++;
  } else {
    carouselPos = 0;
  }
  viewport.style.transform = `translateX(-${carouselPos * 185}px)`;
};
document.querySelector('.carousel-btn.prev').onclick = () => {
  if (carouselPos > 0) {
    carouselPos--;
  } else {
    carouselPos = templates.length - 3;
  }
  viewport.style.transform = `translateX(-${carouselPos * 185}px)`;
};
renderTemplates();

if (window.innerWidth < 860) {
  viewport.style.transform = 'none';
}

// Accessibility for carousel: reset position on resize
window.addEventListener('resize', () => {
  if (window.innerWidth < 860) {
    viewport.style.transform = 'none';
    carouselPos = 0;
  }
});
