const EXPERIMENT_STATE = {
  NONE: 'none',
  CONTROL: 'control',
  VARIANT_A: 'variant-a',
  VARIANT_B: 'variant-b',
  UNKNOWN: 'unknown',
};

const MAP_EXPERIMENT_TO_FILE = {
  [EXPERIMENT_STATE.CONTROL]: '/local-pages/wilson-abtest-sm-ba',
  [EXPERIMENT_STATE.VARIANT_A]: '/local-pages/wilson-abtest-sm-co',
  [EXPERIMENT_STATE.VARIANT_B]: '/local-pages/wilson-abtest-sm-bo',
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
  const isVariantB = document.body.classList.contains('variant-challenger-2');

  if (!isExperiment) {
    return EXPERIMENT_STATE.NONE;
  }
  if (isControl) {
    return EXPERIMENT_STATE.CONTROL;
  }
  if (isVariantA) {
    return EXPERIMENT_STATE.VARIANT_A;
  }
  if (isVariantB) {
    return EXPERIMENT_STATE.VARIANT_B;
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

// // Add this function to your abtesting-OwaA.js
// function executeScriptsFromElement(element) {
//   const scripts = element.querySelectorAll('script');
//   scripts.forEach((script) => {
//     const newScript = document.createElement('script');

//     if (script.src) {
//       // External script
//       newScript.src = script.src;
//       newScript.async = script.async || false;
//     } else {
//       // Inline script
//       newScript.textContent = script.textContent;
//     }

//     // Copy any attributes
//     Array.from(script.attributes).forEach((attr) => {
//       if (attr.name !== 'src') {
//         newScript.setAttribute(attr.name, attr.value);
//       }
//     });

//     document.head.appendChild(newScript);

//     // Remove the original script to avoid duplication
//     script.remove();
//   });
// }

// function executeAllScripts(doc) {
//   const scripts = doc.querySelectorAll('script');

//   scripts.forEach((originalScript, index) => {
//     const newScript = document.createElement('script');

//     // Copy all attributes
//     Array.from(originalScript.attributes).forEach((attr) => {
//       newScript.setAttribute(attr.name, attr.value);
//     });

//     if (originalScript.src) {
//       // External script - load and execute
//       newScript.onload = () => {
//         console.log(`External script ${index} loaded`);
//       };
//     } else {
//       // Inline script - copy content
//       newScript.textContent = originalScript.textContent;
//     }

//     // Append to head or body depending on original location
//     const targetParent = originalScript.closest('head') ? document.head : document.body;
//     targetParent.appendChild(newScript);

//     console.log(`Script ${index} executed`);
//   });
// }

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

    // Execute scripts from the parsed document before adding to DOM
    // executeScriptsFromElement(doc);
    // executeAllScripts(doc);

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

    // if (window.OneTrust) {
    //   delete window.OneTrust;
    //   console.log('OneTrust deleted');
    // }
    // if (window.OptanonWrapper) {
    //   delete window.OptanonWrapper;
    //   console.log('OptanonWrapper deleted');
    // }

    // MANUALLY EXECUTE SCRIPTS (this is the key part)
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
      if (!script.src && script.textContent) {
        // Inline script - execute the code
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.head.appendChild(newScript);
        // script.remove(); // Remove the non-executing copy
      }
      if (script.src) {
        // External script - create a new script element
        const newScript = document.createElement('script');
        newScript.src = script.src;
        document.head.appendChild(newScript);
      }
    });

    // Execute external JS if available
    if (js) {
      const script = document.createElement('script');
      script.textContent = js;
      document.body.appendChild(script);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error applying experiment content:', e);
  }
}

export default async function initExperiment() {
  const experimentState = await getExperimentState();
  await addBody(experimentState);
}
