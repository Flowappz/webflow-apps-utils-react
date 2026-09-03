import { minify, type MinifyOptions } from 'terser';

/**
 * Minifies the provided JavaScript code string.
 */
export const minifyCode = async (code: string, options?: MinifyOptions): Promise<string> => {
  try {
    const result = await minify(code, options);
    if (result.code) {
      return result.code;
    }
    throw new Error('Minification failed: No output code produced.');
  } catch (error) {
    if (error instanceof Error) {
      // Handle specific Error object
      throw new Error(`Minification error: ${error.message}`, { cause: error });
    } else {
      // Handle unknown error types
      throw new Error(`Unexpected error: ${String(error)}`, { cause: error });
    }
  }
};

/**
 * Core script as a string.
 * TODO:  temporary, migrate it to a re-usable util
 */
export const createScriptContent = (coreScript: string): string => {
  const scriptToAdd = `
const injectStyles = () => {
  const curr = document.querySelector(\`style[fs-components-cloak]\`);
  curr?.remove();
  const cloak = document.createElement('style');
  cloak.setAttribute('fs-components-cloak', 'cloak');
  cloak.textContent = \`
     [fs-marquee-instance],[fs-cnumbercount-instance]{ opacity: 0; }
    [fs-consent-element="internal-component"],[fs-consent-element="banner"],[fs-consent-element="fixed-preferences"],[fs-consent-element="preferences"],[fs-consent-element="interaction"]{display:none}
 \`;
  document.head.appendChild(cloak);
};
const initFsComponents = async (url) => {
  injectStyles();
  // happens in-app, check to prevent script being invoked in-app
  const configsLoading = window?.finsweetComponentsConfigLoading;

  const found = document?.querySelector("script[fs-components-src]");
  if (typeof import.meta !== "undefined" && !(found || configsLoading)) {
    const corescript = document?.querySelector(
      'script[finsweet="components"][async][type="module"]'
    );

    const appConfigs = (await import(/* @vite-ignore */ import.meta.url));
    const components = Object.keys(appConfigs) || [];

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const srcUrl = url + "?v=" + new Date().getTime();
      script.src = srcUrl;
      script.type = "module";
      script.async = true;
      script.setAttribute("fs-components-src", import.meta.url);
      script.setAttribute("fs-components-installed", components?.join(","));
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load script"));
      document.head.appendChild(script);
    });
  }
};

// Load dev script
initFsComponents("${coreScript}");`;

  return scriptToAdd;
};
