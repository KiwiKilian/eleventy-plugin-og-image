import test from 'ava';
import { ConcurrencyLimiter } from '../src/concurrencyLimiter.js';

test('concurrency limiter runs all tasks when maxConcurrency is unset', async (t) => {
  const limiter = new ConcurrencyLimiter(undefined);
  let count = 0;

  await Promise.all([
    limiter.run(async () => {
      count++;
    }),
    limiter.run(async () => {
      count++;
    }),
  ]);

  t.is(count, 2);
});

test('concurrency limiter limits parallel execution', async (t) => {
  const limiter = new ConcurrencyLimiter(1);
  let running = 0;
  let maxRunning = 0;

  await Promise.all(
    Array.from({ length: 3 }, () =>
      limiter.run(async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        running--;
      }),
    ),
  );

  t.is(maxRunning, 1);
});
