import { assertEquals } from "@std/assert";
import {Operation} from './~lib.ts'

class Test extends Operation {
  type = 'read' as const
}

Deno.test('it should collapse a path', () => {
  const testData = [{a: 'a', b: 'b'}]
  const op = new Test(testData)
  op.addPathFragment(1)
  op.addPathFragment(2)
  op.addPathFragment((t) => t?.a)
  const serialized = op['serialize'](testData);
  assertEquals(serialized, [["1", "2", "a"]]);
})
