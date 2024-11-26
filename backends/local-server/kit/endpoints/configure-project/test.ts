import {writeFile} from "./_mod.ts";
import axios from "#axios";


Deno.test("configs", async () => {
  const configName = 'dooks'
  const payload = {test: 'data'}
  writeFile(configName, payload)
});

Deno.test('set config', async () => {
  const baseUrl = 'http://localhost:8765'
  const route = '/configure/whoop'
  await axios.post(baseUrl + route, {repo: 'dooks', branch: 'main'})
})
