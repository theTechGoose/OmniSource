import { Resolver } from "@framework";
import {BlandInput} from './controller.ts';
import json from './test-data/email.json' with { type: "json" }

class MockHttp {
  request() {
    return Promise.resolve('ok')
  }
}

Deno.test("it should load leads from email", async () => {
        const {resolver} = Resolver.resolveWithCurrentInstance__Danger__()
        resolver.replace('http', MockHttp) 
        const cl = resolver.resolve(BlandInput)
        const res = await cl.fromPostmarkLink(json)
        const path = import.meta.dirname + '/helpers/data-handler/sample-data/take_two.json'
 })

