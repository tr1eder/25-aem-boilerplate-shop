import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    import('./delayed.js');
    loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  }, 5000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

/* Block rendering for 3 seconds */
const start = Date.now();
while (Date.now() - start < 3000) {
  /* empty */
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('main img').forEach((img) => {
    // Remove width and height to cause layout shift
    img.removeAttribute('width');
    img.removeAttribute('height');
    img.style.width = '75%';
    img.style.height = '75%';
    // Only replace if not already delayed
    if (!img.src.includes('deelay.me')) {
      img.src = `https://deelay.me/8000/${img.src}`;
    }
  });
});

setTimeout(() => {
  const banner = document.createElement('div');
  banner.textContent = '🚨 This is a late-loading banner! 🚨';
  banner.style.background = 'red';
  banner.style.color = 'white';
  banner.style.fontSize = '2rem';
  banner.style.textAlign = 'center';
  banner.style.padding = '32px 0';
  document.body.prepend(banner);
}, 6000);

setTimeout(() => {
  const main = document.querySelector('main');
  if (main) {
    main.style.paddingTop = '200px';
  }
}, 4000);
