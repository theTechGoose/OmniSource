import { assertEquals, assertExists, delay } from '../deps.ts';
import { ProcessManager } from './process-manager.ts';
import { createMockProcess } from '@test-utils';

// Create test class to access protected methods
class TestProcessManager extends ProcessManager {
  public testSpawn(cmd: string) {
    return this._spawn(cmd);
  }
}

// Mock runCommand to return our mock process
const originalRunCommand = globalThis.runCommand;
const mockRunCommand = (_root: string, _cmd: string[]) => createMockProcess();

Deno.test('ProcessManager', async (t) => {
  let pm: TestProcessManager;

  // Setup and teardown
  t.beforeEach(() => {
    (globalThis as any).runCommand = mockRunCommand;
    pm = new TestProcessManager('/test/root');
  });

  t.afterEach(() => {
    (globalThis as any).runCommand = originalRunCommand;
    pm.killAll();
  });

  await t.step('should create and track processes', () => {
    const process = pm.testSpawn('test command');
    assertExists(process);
    assertEquals(pm.processes.length, 1);
  });

  await t.step('should kill all processes', () => {
    const process = pm.testSpawn('test command');
    pm.killAll();
    assertEquals((process as any).killed, true);
    assertEquals(pm.processes.length, 1); // Processes array is not cleared
  });

  await t.step('should debounce process spawning', async () => {
    pm.spawn('test command');
    pm.spawn('test command');
    pm.spawn('test command');

    // Wait for debounce timeout
    await delay(3100);

    // Should only spawn one process due to debouncing
    assertEquals(pm.processes.length, 1);
  });

  await t.step('should handle multiple commands', () => {
    const cmds = ['cmd1', 'cmd2', 'cmd3'];
    pm.handleChange(cmds, 'test comment');
    assertEquals(pm.processes.length, 3);
  });
});
