import { assertEquals } from "#std/asserts";
import { Server, Endpoint } from "./mod.ts";
import { Context } from "#oak";

Deno.test("Server - constructor", () => {
  const endpoints: Endpoint[] = [];
  const server = new Server(endpoints);
  assertEquals(server instanceof Server, true);
});

Deno.test("Server - middleware", async () => {
  const endpoints: Endpoint[] = [];
  const server = new Server(endpoints);
  let middlewareCalled = false;

  server.addMiddleware(async (ctx: Context) => {
    middlewareCalled = true;
    await ctx.next();
  });

  assertEquals(middlewareCalled, false, "Middleware should not be called until request");
});
