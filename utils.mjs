// @ts-check

/**
 * Log with a consistent prefix.
 * @param {any} message
 * @param {...any} rest
 */
export function log(message, ...rest) {
  console.log("[persona]", message, ...rest);
}
