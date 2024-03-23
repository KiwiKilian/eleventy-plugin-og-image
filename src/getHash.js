import crypto from 'node:crypto';

/**
 * @param { string } input
 * @param { number } hashLength
 *
 * @returns { string }
 * */
export function getHash({ input, hashLength }) {
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, hashLength);
}
