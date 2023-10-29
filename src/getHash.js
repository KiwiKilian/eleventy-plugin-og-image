import { createHash } from 'crypto';

/**
 * @param { string } input
 * @param { number } hashLength
 *
 * @returns { string }
 * */
export function getHash({ input, hashLength }) {
  return createHash('sha256').update(input).digest('base64url').substring(0, hashLength);
}
