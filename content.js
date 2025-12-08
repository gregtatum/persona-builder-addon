// @ts-check
import { log } from "./utils.mjs";

/**
 * @param {unknown} message
 */
browser.runtime.onMessage.addListener((message) => {
  log("Persona Builder stub content script received message", message);
});
