import test from 'ava';
import { sortObject } from '../src/utils/index.js';

test('sorts keys', (t) => {
  t.is(
    JSON.stringify({
      a: 'a',
      b: {
        a: 'a',
        b: 'b',
      },
    }),
    JSON.stringify(
      sortObject({
        b: {
          b: 'b',
          a: 'a',
        },
        a: 'a',
      }),
    ),
  );
});
