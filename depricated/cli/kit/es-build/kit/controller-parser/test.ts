import {getController} from '../controller-getter/_mod.ts'
import {parseController} from "./_mod.ts";

const testPath = '/Users/goose/Documents/New_Programing/OmniSource/backends/ai-activations/controllers/booksi-act-text/config.ts'

Deno.test('it should parse a controller', async () => {
  const controller = await getController(testPath);
  const parsed = parseController(controller);
  console.log(parsed)

})
