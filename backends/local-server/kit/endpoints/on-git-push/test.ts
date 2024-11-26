import {parseGitBody, getBranch} from "./_mod.ts";
import {test_data} from "@test-data/github-push.ts";

Deno.test('parseGitBody', async () => {
  const data = parseGitBody(test_data)
  const branch = getBranch(data.ref)
  console.log(data)
})
