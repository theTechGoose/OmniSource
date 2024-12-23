import {assertEquals} from '#assert';
import {sleep} from './sleep.ts';

Deno.test('sleep function', async () => {
  const start = Date.now();
  const waitTime = 100;
  await sleep(waitTime);
  const elapsed = Date.now() - start;
  assertEquals(elapsed >= waitTime, true);
  assertEquals(elapsed < waitTime + 50, true);
});
