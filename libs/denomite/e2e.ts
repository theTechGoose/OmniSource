import { assertEquals } from "#std/assert";
import { Server, Endpoint } from "./mod.ts";

Deno.test("Integration - Full server flow", async () => {
  const endpoints: Endpoint[] = [
    {
      route: "/test",
      method: "get",
      auth: () => true,
      handler: async () => Promise.resolve({ message: "success" })
    }
  ];

  const server = new Server(endpoints);
  const port = 8000;

  try {
    const startPromise = server.start(port);
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await fetch(`http://localhost:${port}/test`);
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.message, "success");

    await server.stop();
    await startPromise;
  } catch (error) {
    await server.stop();
    throw error;
  }
});
