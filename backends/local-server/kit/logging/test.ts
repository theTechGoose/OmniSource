import {Logger} from "./_mod.ts";


Deno.test("logger", async () => {
  const logger = new Logger('prod');

  logger.log('test', 'hello world2', {test: 'data'})

})
