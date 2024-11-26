import '@global_models';
import {SlickText} from './mod.ts';
import {Resolver} from '../../core/resolver/~mod.ts';

Deno.test("it should build a contact in slicktext", async () => {
  const resolver = new Resolver();
  resolver.__DANGER__SELF_REGISTER_TESTS_ONLY()
  const slickText = resolver.resolve(SlickText)
  const req = await slickText.optIn({
    firstName: "John",
    zip: "12345",
    city: "New York",
    email: "rmc11607@yahoo.com",
    state: "NY",
    lastName: "Test",
    phoneNumber: "+18438557133"
  })
  console.log(req)
})
