import {assertEquals} from '#assert';
import {getArg, _internals} from './get-arg.ts';

Deno.test('getArg function', () => {
  _internals.setMockArgs(['--test=value']);
  assertEquals(getArg('test'), 'value');
  _internals.setMockArgs(null);
});
