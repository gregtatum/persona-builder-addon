// @ts-check

/**
 * @param {any} message
 * @param {...any} rest
 */
export function log(message, ...rest) {
  console.log("[persona]", message, ...rest);
}

/** @type {Promise<any> | null} */
let singleFilePromise = null;

async function getSingleFile() {
  if (!singleFilePromise) {
    const { promise, resolve, reject } = Promise.withResolvers();
    singleFilePromise = promise;

    try {
      await import(browser.runtime.getURL("vendor/singlefile/single-file.js"));
      // @ts-expect-error - This is placed as a global.
      resolve(globalThis.singlefile);
    } catch (error) {
      reject(error);
    }
  }
  return singleFilePromise;
}

log("Content script loaded");

async function capturePageSnapshot() {
  try {
    const singlefile = await getSingleFile();
    const pageData = await singlefile.getPageData({
      // This can cause long hangs if there are many images that need loading.
      loadDeferredImages: false,
      // Frames are causing this code to hange for some reason. I think the SingleFile
      // web extension does some extra work to inject frame handlers.
      // See: https://github.com/gildas-lormeau/SingleFile/blob/f3fb2685821d96b116c30c43f65945291e2a6e0b/manifest.json#L14-L55
      removeFrames: true,
    });
    return { ok: true, content: pageData.content };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Capture page snapshot failed", error);
    return { ok: false, error: errorMessage };
  }
}

/**
 * @param {unknown} message
 * @param {browser.runtime.MessageSender} _sender
 * @param {(response?: any) => void} sendResponse
 */
browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  log("Message", message);

  switch (message.type) {
    case "capture-page-snapshot":
      return capturePageSnapshot();
  }
});
