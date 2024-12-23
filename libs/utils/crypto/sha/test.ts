import {assertEquals} from '#assert';
import {generateSHA256Hash} from './mod.ts';

Deno.test("SHA-256 Hash", async () => {
  const testStr = 'DOOKSTER'
  const res = await generateSHA256Hash(testStr)
  const sample = 'bf7c539125a56152772f02cf2eba7ac72ddb15ca81f8ac01166c10d13f828d40'
  assertEquals(res, sample)
})
