export class Util {
  static sortObject(unordered) {
    const keys = Object.keys(unordered).sort();

    return keys.reduce((object, key) => {
      object[key] = typeof unordered[key] === 'object' ? Util.sortObject(unordered[key]) : unordered[key];

      return object;
    }, {});
  }
}
