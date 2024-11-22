import { assertEquals } from "@std/assert/equals";
import {Reader} from './~lib.ts'

Deno.test('it should build a read correctly', () => {
  const reader = new Reader(['a', 'b']).start([1, 2]).end([3, 4]).limit(5);
  reader.exec();
  assertEquals(reader.payload, {
    type: 'list',
    path: ['a', 'b'],
    start: [1, 2],
    end: [3, 4],
    limit: 5,
})

})
