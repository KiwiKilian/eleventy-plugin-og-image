import crypto from 'node:crypto';
import { sortObject } from './sortObject.js';

/**
 * Replaces font data buffers with a stable digest so large binaries are not
 * re-serialized on every hash computation.
 *
 * @param {unknown} value
 * @returns {unknown}
 */
function sanitizeFontData(value) {
  if (Buffer.isBuffer(value)) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeFontData);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, sanitizeFontData(entryValue)]),
    );
  }

  return value;
}

/**
 * @typedef {{ satori: Record<string, unknown>; sharp: Record<string, unknown> }} PreparedOptionsForHash
 */

/**
 * Sorts and sanitizes options once so they can be reused for stable hashing.
 *
 * @param {import('satori').SatoriOptions | undefined} satoriOptions
 * @param {import('sharp').Sharp['toFormat'] extends (format: infer F, options?: infer O) => any ? O : never} [sharpOptions]
 * @returns {PreparedOptionsForHash}
 */
export function prepareOptionsForHash(satoriOptions, sharpOptions) {
  return {
    satori: sortObject(sanitizeFontData(satoriOptions || {})),
    sharp: sortObject(sharpOptions || {}),
  };
}

/**
 * Returns a stable string representation of satori and sharp options for hashing.
 *
 * @param {import('satori').SatoriOptions | undefined} satoriOptions
 * @param {import('sharp').Sharp['toFormat'] extends (format: infer F, options?: infer O) => any ? O : never} [sharpOptions]
 * @param {PreparedOptionsForHash} [preparedOptionsForHash]
 * @returns {string}
 */
export function computeOptionsHash(satoriOptions, sharpOptions, preparedOptionsForHash) {
  const prepared = preparedOptionsForHash || prepareOptionsForHash(satoriOptions, sharpOptions);

  return `${JSON.stringify(prepared.satori)}${JSON.stringify(prepared.sharp)}`;
}
