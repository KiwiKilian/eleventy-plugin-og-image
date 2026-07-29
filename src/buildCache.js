import crypto from 'node:crypto';
import { sortObject } from './utils/sortObject.js';

/**
 * @typedef {{ html?: string; svg?: string; pngBuffer?: Buffer }} BuildCacheEntry
 */

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function serializeValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'function') {
    return undefined;
  }

  if (Buffer.isBuffer(value)) {
    return value.toString('base64');
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue).filter((entry) => entry !== undefined);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => typeof entryValue !== 'function')
        .map(([key, entryValue]) => [key, serializeValue(entryValue)]),
    );
  }

  return value;
}

/**
 * @param {string} inputPath
 * @param {Record<string, any>} data
 * @param {string} optionsHash
 * @param {number} [templateMtime]
 * @returns {string}
 */
export function buildCacheKey(inputPath, data, optionsHash, templateMtime) {
  const hash = crypto.createHash('sha256');

  hash.update(inputPath);
  hash.update(optionsHash);
  hash.update(JSON.stringify(sortObject(serializeValue(data) || {})));

  if (templateMtime !== undefined) {
    hash.update(String(templateMtime));
  }

  return hash.digest('hex');
}

export class BuildCache {
  /** @type {Map<string, BuildCacheEntry>} */
  #entries = new Map();

  clear() {
    this.#entries.clear();
  }

  /**
   * @param {string} key
   * @returns {BuildCacheEntry | undefined}
   */
  get(key) {
    return this.#entries.get(key);
  }

  /**
   * @param {string} key
   * @param {BuildCacheEntry} entry
   */
  set(key, entry) {
    const existing = this.#entries.get(key) || {};

    this.#entries.set(key, { ...existing, ...entry });
  }
}
