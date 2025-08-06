const EXPERIMENT_STATE = {
  NONE: 'none',
  CONTROL: 'control',
  VARIANT_A: 'variant-a',
  UNKNOWN: 'unknown',
};

const MAP_EXPERIMENT_TO_FILE = {
  [EXPERIMENT_STATE.CONTROL]: '/local-pages/my-wilson-a',
  [EXPERIMENT_STATE.VARIANT_A]: '/local-pages/my-wilson-b',
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

async function fetchFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (response.ok) {
      return response.text();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch file at ${filePath}`, error);
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
    const html = await fetchFile(`${contentPath}.html`);
    const css = await fetchFile(`${contentPath}.css`);
    const js = await fetchFile(`${contentPath}.js`);

    if (!html || !css || !js) {
      // eslint-disable-next-line no-console
      console.error('Failed to load one or more experiment resources.');
      return;
    }

    // Remove all existing style and link tags to ensure a clean slate
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());

    // Apply all CSS by creating a new style tag
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Replace inner HTML of header, main, and footer
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const sections = ['header', 'main', 'footer'];
    sections.forEach((selector) => {
      const sourceElement = doc.querySelector(selector);
      const targetElement = document.querySelector(selector);
      if (sourceElement && targetElement) {
        targetElement.innerHTML = sourceElement.innerHTML;
      }
    });

    // Execute the script by creating and appending a script tag
    const script = document.createElement('script');
    script.textContent = js;
    document.body.appendChild(script);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error applying experiment content:', e);
  }
}

export default async function initExperiment() {
  const experimentState = await getExperimentState();
  await addBody(experimentState);
}
