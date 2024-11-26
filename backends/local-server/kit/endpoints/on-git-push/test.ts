import {parseGitBody} from "./_mod.ts";
import {test_data} from "@test-data/github-push.ts";

Deno.test('parseGitBody', async () => {
  const data = parseGitBody(test_data)
  console.log(data)
})
