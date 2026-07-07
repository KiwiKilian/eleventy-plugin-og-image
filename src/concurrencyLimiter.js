export class ConcurrencyLimiter {
  /** @type {number | undefined} */
  #max;

  /** @type {number} */
  #running = 0;

  /** @type {Array<() => void>} */
  #queue = [];

  /**
   * @param {number | undefined} max
   */
  constructor(max) {
    this.#max = max;
  }

  /**
   * @template T
   * @param {() => Promise<T>} task
   * @returns {Promise<T>}
   */
  async run(task) {
    if (!this.#max) {
      return task();
    }

    await this.#acquire();

    try {
      return await task();
    } finally {
      this.#release();
    }
  }

  /** @returns {Promise<void>} */
  #acquire() {
    if (this.#running < this.#max) {
      this.#running++;

      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.#queue.push(() => {
        resolve();
      });
    });
  }

  #release() {
    this.#running--;
    const next = this.#queue.shift();

    if (next) {
      this.#running++;
      next();
    }
  }
}
