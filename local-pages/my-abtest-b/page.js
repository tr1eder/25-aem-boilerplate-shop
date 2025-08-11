// Showcase "Made with DreamSite" sites
const showcaseSites = [
  {
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    alt: "Business site",
    name: "Salon Studio"
  },
  {
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    alt: "Portfolio site",
    name: "Milo Portfolio"
  },
  {
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    alt: "Service business",
    name: "Peachy Cleaners"
  },
  {
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    alt: "Ecommerce store",
    name: "Teezy Shop"
  },
  {
    img: "https://images.unsplash.com/photo-1465101178521-c1a8889a96c9",
    alt: "Startup site",
    name: "NextGen Apps"
  },
  {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    alt: "Blog site",
    name: "Wander Blog"
  }
];

const showcaseScroll = document.getElementById('showcase-scroll');
function loadShowcase() {
  showcaseScroll.innerHTML = '';
  showcaseSites.forEach(site => {
    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `<img src="${site.img}" alt="${site.alt}"><h3>${site.name}</h3>`;
    card.onclick = () => alert(`View site: ${site.name}`);
    showcaseScroll.appendChild(card);
  });
}
loadShowcase();

// AI builder demo
document.getElementById('ai-form').addEventListener('submit', function(evt) {
  evt.preventDefault();
  const desc = document.getElementById('business-desc').value.trim();
  const output = document.getElementById('ai-demo-output');
  if (!desc) {
    output.textContent = "Please enter a description so our AI can generate your site preview.";
    return;
  }
  output.innerHTML = `<b>Your AI-Generated Website:</b><br>
    <ul>
      <li><strong>Homepage:</strong> Elegant header, hero photo, business description: "${desc}".</li>
      <li><strong>Contact & Booking:</strong> Fully integrated forms and calendar.</li>
      <li><strong>Template Design:</strong> Selected for industry fit.</li>
      <li><strong>Mobile-friendly:</strong> Preview available for both desktop and phone.</li>
      <li><strong>Next step:</strong> <a href="#signup">Build for Real!</a></li>
    </ul>`;
});

// Accessibility fix: horizontal scroll on showcase, improves UX for mobile
if ('ontouchstart' in window) {
  showcaseScroll.style.webkitOverflowScrolling = 'touch';
}
