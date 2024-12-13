import { assertEquals } from "#std/assert";
import { Server, Endpoint } from "./mod.ts";

Deno.test("Server - Basic routing", async () => {
  const endpoints: Endpoint[] = [
    {
      route: "/test",
      method: "get",
      auth: () => true,
      handler: async () => Promise.resolve({ message: "success" })
    }
  ];

  const server = new Server(endpoints);
  assertEquals(server instanceof Server, true);
});
