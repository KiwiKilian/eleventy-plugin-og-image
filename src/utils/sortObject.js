/**
 * Sorts an object recursively
 *
 * @param {object} unordered
 * @returns {object}
 */
export function sortObject(unordered) {
  const keys = Object.keys(unordered).sort();

  return keys.reduce((object, key) => {
    object[key] = typeof unordered[key] === 'object' ? sortObject(unordered[key]) : unordered[key];

    return object;
  }, {});
}
