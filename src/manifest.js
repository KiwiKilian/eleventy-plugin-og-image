import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * @typedef {{ dataHash: string; outputFileName: string }} OgImageManifestEntry
 */

export class OgImageManifest {
  /** @type {string} */
  #manifestPath;

  /** @type {Record<string, OgImageManifestEntry>} */
  #entries = {};

  /**
   * @param {string} manifestPath
   */
  constructor(manifestPath) {
    this.#manifestPath = manifestPath;
  }

  async load() {
    try {
      const contents = await fs.readFile(this.#manifestPath, 'utf8');

      this.#entries = JSON.parse(contents);
    } catch {
      this.#entries = {};
    }
  }

  async save() {
    try {
      await fs.mkdir(path.dirname(this.#manifestPath), { recursive: true });
    } catch {
      // Directory may already exist.
    }

    await fs.writeFile(this.#manifestPath, `${JSON.stringify(this.#entries, null, 2)}\n`, 'utf8');
  }

  /**
   * @param {string} pageUrl
   * @returns {OgImageManifestEntry | undefined}
   */
  get(pageUrl) {
    return this.#entries[pageUrl];
  }

  /**
   * @param {string} pageUrl
   * @param {OgImageManifestEntry} entry
   */
  set(pageUrl, entry) {
    this.#entries[pageUrl] = entry;
  }
}
