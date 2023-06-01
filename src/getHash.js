const { createHash } = require('crypto');

module.exports = {
  /**
   * @param { string } input
   * @param { number } hashLength
   *
   * @returns { string }
   * */
  getHash({ input, hashLength }) {
    return createHash('sha256').update(input).digest('base64url').substring(0, hashLength);
  },
};
