import { assertEquals } from "#std/asserts";
import { Server, Endpoint } from "./mod.ts";
import { Context } from "#oak";

Deno.test("Server e2e - basic routing and authentication", async () => {
  const endpoints: Endpoint[] = [
    {
      route: "/test",
      method: "get",
      auth: () => true,
      handler: async (ctx: Context) => {
        return { message: "success" };
      },
    },
    {
      route: "/protected",
      method: "post",
      auth: () => false,
      handler: async (ctx: Context) => {
        return { message: "protected" };
      },
    },
  ];

  const server = new Server(endpoints);
  // Add test middleware
  server.addMiddleware(async (ctx: Context) => {
    ctx.state.test = true;
    await ctx.next();
  });

  // Start server in background
  const port = 8080;
  server.start(port);

  try {
    // Test public endpoint
    const publicRes = await fetch(`http://localhost:${port}/test`);
    assertEquals(publicRes.status, 200);
    const publicData = await publicRes.json();
    assertEquals(publicData.message, "success");

    // Test protected endpoint
    const protectedRes = await fetch(`http://localhost:${port}/protected`, {
      method: "POST",
    });
    assertEquals(protectedRes.status, 401);
    const protectedData = await protectedRes.json();
    assertEquals(protectedData.message, "Unauthorized");
  } catch (err) {
    throw err;
  }
});
