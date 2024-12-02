import {getController} from "./_mod.ts";

const testPath = '/Users/goose/Documents/New_Programing/OmniSource/backends/ai-activations/controllers/booksi-act-text/config.ts'

Deno.test('it gets a controller reference and source', async () => {
  const controller = await getController(testPath);
  assertEquals(controller.constructorReference.name, 'BooksiActText');

})
