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
 * Returns a stable string representation of satori and sharp options for hashing.
 *
 * @param {import('satori').SatoriOptions | undefined} satoriOptions
 * @param {import('sharp').Sharp['toFormat'] extends (format: infer F, options?: infer O) => any ? O : never} [sharpOptions]
 * @returns {string}
 */
export function computeOptionsHash(satoriOptions, sharpOptions) {
  const sanitizedSatori = sortObject(sanitizeFontData(satoriOptions || {}));
  const sortedSharp = sortObject(sharpOptions || {});

  return `${JSON.stringify(sanitizedSatori)}${JSON.stringify(sortedSharp)}`;
}
