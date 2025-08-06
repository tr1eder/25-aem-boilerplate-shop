import {
  sampleRUM,
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
  getMetadata,
  loadScript,
  toCamelCase,
  toClassName,
} from './aem.js';

import initExperiment from './abtesting-OwaA.js';

// This should be executed as early as possible to populate the body.
initExperiment();

const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  // define your custom audiences here as needed
};

/**
 * Gets all the metadata elements that are in the given scope.
 * @param {String} scope The scope/prefix for the metadata
 * @returns an array of HTMLElement nodes that match the given scope
 */
export function getAllMetadata(scope) {
  return [...document.head.querySelectorAll(`meta[property^="${scope}:"],meta[name^="${scope}-"]`)].reduce((res, meta) => {
    const id = toClassName(meta.name ? meta.name.substring(scope.length + 1) : meta.getAttribute('property').split(':')[1]);
    res[id] = meta.getAttribute('content');
    return res;
  }, {});
}

// Define an execution context
const pluginContext = {
  getAllMetadata,
  getMetadata,
  loadCSS,
  loadScript,
  sampleRUM,
  toCamelCase,
  toClassName,
};

const DELAY_TIME = 0;

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
  // Add below snippet early in the eager phase
  if (getMetadata('experiment') || Object.keys(getAllMetadata('campaign')).length || Object.keys(getAllMetadata('audience')).length) {
    // eslint-disable-next-line import/no-relative-packages
    const { loadEager: runEager } = await import('../plugins/experimentation/src/index.js');
    await runEager(document, { audiences: AUDIENCES }, pluginContext);
  }

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

  await new Promise((resolve) => {
    setTimeout(resolve, DELAY_TIME / 2.4);
  });
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  if (getMetadata('experiment') || Object.keys(getAllMetadata('campaign')).length || Object.keys(getAllMetadata('audience')).length) {
    // eslint-disable-next-line import/no-relative-packages
    const { loadLazy: runLazy } = await import('../plugins/experimentation/src/index.js');
    await runLazy(document, { audiences: AUDIENCES }, pluginContext);
  }
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
  }, DELAY_TIME / 3.1415926535897);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await new Promise((resolve) => {
    setTimeout(resolve, DELAY_TIME / 2.4);
  });
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

function acceptNode(node) {
  // Accept only text nodes that contain at least one word character
  return /\w/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
}

// Animate all text content word by word
function animateTextWordByWord(root = document.body, delay = 50) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, acceptNode);
  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  textNodes.forEach((node) => {
    const words = node.nodeValue.match(/\S+|\s+/g) || [];
    const parent = node.parentNode;
    const span = document.createElement('span');
    parent.replaceChild(span, node);
    let i = 0;
    function showNextWord() {
      if (i < words.length) {
        span.append(words[i]);
        i += 1;
        setTimeout(showNextWord, delay);
      }
    }
    showNextWord();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (DELAY_TIME > 1000) {
    animateTextWordByWord(document.body, 150);
  }
});

/* Block rendering for 3 seconds */
const start = Date.now();
while (Date.now() - start < DELAY_TIME / 1.4) {
  /* empty */
}

if (DELAY_TIME > 1000) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('main img').forEach((img) => {
      // Remove width and height to cause layout shift
      img.removeAttribute('width');
      img.removeAttribute('height');
      img.style.width = '75%';
      img.style.height = '75%';
      // Only replace if not already delayed
      if (!img.src.includes('deelay.me')) {
        img.src = `https://deelay.me/${DELAY_TIME}/${img.src}`;
      }
    });
  });
}

if (DELAY_TIME > 1000) {
  const banner = document.createElement('div');
  banner.textContent = '🚨 This is a late-loading banner! 🚨';
  banner.style.background = 'red';
  banner.style.color = 'white';
  banner.style.fontSize = '2rem';
  banner.style.textAlign = 'center';
  banner.style.padding = '32px 0';
  document.body.prepend(banner);
  setInterval(() => {
    banner.style.display = banner.style.display === 'none' ? 'block' : 'none';
  }, DELAY_TIME / 10);
}

setTimeout(() => {
  const main = document.querySelector('main');
  if (main && DELAY_TIME > 1000) {
    main.style.paddingTop = '200px';
  }
}, DELAY_TIME / 1.1);
