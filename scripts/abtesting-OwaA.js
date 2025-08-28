const EXPERIMENT_STATE = {
  NONE: 'none',
  CONTROL: 'control',
  VARIANT_A: 'variant-a',
  UNKNOWN: 'unknown',
};

const MAP_EXPERIMENT_TO_FILE = {
  [EXPERIMENT_STATE.CONTROL]: '/local-pages/wilson-abtest-sm-a',
  [EXPERIMENT_STATE.VARIANT_A]: '/local-pages/wilson-abtest-sm-c',
};

async function getExperimentState() {
  /* Can be done with less lines */
  await new Promise((resolve) => {
    const observer = new MutationObserver((mutations, obs) => {
      if (document.body.classList.contains('appear')) {
        obs.disconnect();
        resolve();
      }
    });

    const checkForBody = () => {
      if (document.body) {
        if (document.body.classList.contains('appear')) {
          resolve();
        } else {
          observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
          });
        }
      } else {
        window.requestAnimationFrame(checkForBody);
      }
    };

    checkForBody();
  });
  const isExperiment = document.body.classList.contains('experiment-operator-with-an-attitude');
  const isControl = document.body.classList.contains('variant-control');
  const isVariantA = document.body.classList.contains('variant-challenger-1');

  if (!isExperiment) {
    return EXPERIMENT_STATE.NONE;
  }
  if (isControl) {
    return EXPERIMENT_STATE.CONTROL;
  }
  if (isVariantA) {
    return EXPERIMENT_STATE.VARIANT_A;
  }
  return EXPERIMENT_STATE.UNKNOWN;
}

async function fetchFile(filePath, optional = false) {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      return response.text();
    }
  } catch (error) {
    if (!optional) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch file at ${filePath}`, error);
    }
  }
  return null;
}

/**
 * Asynchronously fetches HTML content for a given experiment state and
 * replaces the content of the `<main>` element with it.
 * @type {(expState: string) => Promise<void>}
 * @param {string} expState The current experiment state, used to look up the content path.
 * @returns {Promise<void>} A promise that resolves when the content has been added, or rejects on error.
 */
async function addBody(expState) {
  const contentPath = MAP_EXPERIMENT_TO_FILE[expState];
  if (!contentPath) {
    return;
  }

  try {
    // Use the existing fetchFile function to get all resources
    const html = await fetchFile(`${contentPath}/page.html`);
    const css = await fetchFile(`${contentPath}/page.css`, true);
    const js = await fetchFile(`${contentPath}/page.js`, true);

    if (!html) {
      // eslint-disable-next-line no-console
      console.error('Failed to load page.html - this is required.');
      return;
    }

    // Remove all existing style and link tags to ensure a clean slate
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());

    // Apply CSS if available
    if (css) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Parse the HTML document
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Copy head elements in order: link, script, style
    const headElements = ['link', 'script', 'style'];
    headElements.forEach((tagName) => {
      doc.head.querySelectorAll(tagName).forEach((element) => {
        document.head.appendChild(element.cloneNode(true));
      });
    });

    // 1. Delete existing header, main, footer elements completely
    const elementsToDelete = ['header', 'main', 'footer'];
    elementsToDelete.forEach((selector) => {
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        targetElement.remove();
      }
    });

    // 2. Combine CSS classes from current body and fetched body
    const currentBodyClasses = Array.from(document.body.classList);
    const fetchedBodyClasses = Array.from(doc.body.classList);
    const combinedClasses = [...new Set([...currentBodyClasses, ...fetchedBodyClasses])];
    document.body.className = combinedClasses.join(' ');

    // 3. Add entire body content from fetched HTML at the end of DOM
    Array.from(doc.body.children).forEach((element) => {
      document.body.appendChild(element.cloneNode(true));
    });

    // Execute external JS if available
    if (js) {
      const script = document.createElement('script');
      script.textContent = js;
      document.body.appendChild(script);
    }

    // Force OneTrust to reinitialize after content injection
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Attempting to reinitialize OneTrust...');

      // Clear any existing OneTrust state
      if (window.OneTrust) {
        delete window.OneTrust;
      }
      if (window.OptanonWrapper) {
        delete window.OptanonWrapper;
      }

      // Find and re-execute OneTrust script
      const oneTrustScript = document.querySelector('script[src*="oneTrust"]');
      if (oneTrustScript) {
        // eslint-disable-next-line no-console
        console.log('Found OneTrust script, reloading...');

        // Create a new script element to force re-execution
        const newScript = document.createElement('script');
        newScript.src = oneTrustScript.src;
        newScript.setAttribute('data-domain-script', oneTrustScript.getAttribute('data-domain-script'));
        newScript.setAttribute('data-document-language', 'true');
        newScript.type = 'text/javascript';

        // Remove old script and add new one
        oneTrustScript.remove();
        document.head.appendChild(newScript);

        // Wait for script to load and initialize
        newScript.onload = () => {
          setTimeout(() => {
            if (window.OneTrust) {
              // eslint-disable-next-line no-console
              console.log('OneTrust reloaded, forcing banner display');
              try {
                // Force show the banner
                window.OneTrust.NoticeApi.Loaded.then(() => {
                  window.OneTrust.NoticeApi.LoadNotice();
                });
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error forcing OneTrust banner:', error);
              }
            }
          }, 1000);
        };
      } else {
        // eslint-disable-next-line no-console
        console.log('OneTrust script not found');
      }
    }, 1000);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error applying experiment content:', e);
  }
}

export default async function initExperiment() {
  const experimentState = await getExperimentState();
  await addBody(experimentState);
}
