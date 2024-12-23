import {assertEquals, assertMatch} from '#assert';
import {getStackTrace} from './get-current-file.ts';

Deno.test('getStackTrace function', () => {
  const stack = getStackTrace();
  assertEquals(typeof stack.matches, 'object');
  assertEquals(Array.isArray(stack.matches), true);
  const firstEntry = stack.getFirst('url');
  assertMatch(firstEntry || '', /get-current-file\.test\.ts/);
});
