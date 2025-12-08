// @ts-check
import { log } from "./utils.mjs";

browser.runtime.onInstalled.addListener(() => {
  log("Persona Builder stub installed");
});

/**
 * @param {unknown} message
 */
browser.runtime.onMessage.addListener((message) => {
  log("Persona Builder stub received message", message);
});
