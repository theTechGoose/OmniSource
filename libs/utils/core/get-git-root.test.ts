import { assertEquals } from '../deps.ts';
import { getGitRoot } from './get-git-root.ts';

Deno.test('getGitRoot', async (t) => {
  await t.step('should return git root path', async () => {
    const root = await getGitRoot();
    assertEquals(typeof root, 'string');
    assertEquals(root.endsWith('OmniSource'), true);
  });

  await t.step('should handle non-git directory', async () => {
    const root = await getGitRoot('/tmp');
    assertEquals(root, null);
  });
});
