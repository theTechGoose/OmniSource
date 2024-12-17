import { assertEquals, assertExists, delay } from "#std/assert";
import { ProcessManager } from "./process-manager.ts";
import { runCommand } from "./run-cmd.ts";
import { createMockProcess } from "@test-utils";

class TestProcessManager extends ProcessManager {
  public processes: Deno.ChildProcess[] = [];

  protected spawn(cmd: string): Deno.ChildProcess {
    const process = createMockProcess();
    this.processes.push(process);
    return process;
  }

  public killAll(): void {
    this.processes.forEach((process) => process.kill());
  }
}

// Store original runCommand
const originalRunCommand = runCommand;

Deno.test("ProcessManager", async (t) => {
  let pm: TestProcessManager;

  // Setup and teardown
  t.beforeEach(() => {
    pm = new TestProcessManager();
  });

  t.afterEach(() => {
    pm.killAll();
  });

  await t.step("should create and track processes", () => {
    const process = pm.spawn("test command");
    assertExists(process);
    assertEquals(pm.processes.length, 1);
  });

  await t.step("should kill all processes", () => {
    const process = pm.spawn("test command");
    pm.killAll();
    assertEquals((process as any).killed, true);
    assertEquals(pm.processes.length, 1); // Processes array is not cleared
  });

  await t.step("should debounce process spawning", async () => {
    pm.spawn("test command");
    pm.spawn("test command");
    pm.spawn("test command");

    // Wait for debounce timeout
    await delay(3100);

    // Should only spawn one process due to debouncing
    assertEquals(pm.processes.length, 1);
  });

  await t.step("should handle multiple commands", () => {
    const cmds = ["cmd1", "cmd2", "cmd3"];
    pm.handleChange(cmds, "test comment");
    assertEquals(pm.processes.length, 3);
  });
});
