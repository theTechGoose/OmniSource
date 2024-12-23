import {assertThrows} from '#assert';
import {thrw} from './thrw.ts';

Deno.test('throw function', () => {
  const errorMsg = 'Test error message';
  assertThrows(
    () => thrw(errorMsg),
    Error,
    errorMsg
  );
});
