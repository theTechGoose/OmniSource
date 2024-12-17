import { assertEquals } from "#std/assert";
import { runCommand } from "./run-cmd.ts";
import { createMockProcess } from "@test-utils";

// Mock Deno.Command
const originalCommand = Deno.Command;
const mockCommand = () => ({
  spawn: () => createMockProcess(),
});

Deno.test("runCommand", async (t) => {
  // Setup and teardown
  t.beforeEach(() => {
    (Deno as any).Command = mockCommand;
  });

  t.afterEach(() => {
    (Deno as any).Command = originalCommand;
  });

  await t.step("should execute command and return child process", () => {
    const process = runCommand("/test/root", ["test", "command"]);
    assertEquals(typeof process.pid, "number");
    assertEquals(process.killed, false);
  });

  await t.step("should handle command completion", async () => {
    const process = runCommand("/test/root", ["test", "command"]);
    const status = await process.status;
    assertEquals(status.success, true);
    assertEquals(status.code, 0);
  });
});
