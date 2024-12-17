import { assertEquals } from '../deps.ts';
import { lookupWorkspace } from './get-workspace-names.ts';

Deno.test('lookupWorkspace', async (t) => {
  await t.step('should return workspace names', async () => {
    const names = await lookupWorkspace();
    assertEquals(Array.isArray(names), true);
    assertEquals(names.length > 0, true);
  });

  await t.step('should strip prefixes', async () => {
    const names = await lookupWorkspace('./libs/', '/');
    assertEquals(Array.isArray(names), true);
    assertEquals(names.some(name => name.startsWith('./libs/')), false);
  });

  await t.step('should handle invalid workspace path', async () => {
    const names = await lookupWorkspace('/nonexistent/path');
    assertEquals(names.length, 0);
  });
});
