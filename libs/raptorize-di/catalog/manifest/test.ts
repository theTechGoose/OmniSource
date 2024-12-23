import {assertEquals} from '#assert';
import {DependencyManifest, PreparedDependency} from './mod.ts';

Deno.test('it should add a dependency', () => {
  const repo = new DependencyManifest();
  const dep = new PreparedDependency(class Test {}, []);
  repo.addDependency(dep);
  assertEquals(repo['manifest'].length, 1);
})

Deno.test('it should get a depenedency by constructor', () => {
  class Test {}
  const repo = new DependencyManifest();
  const dep = new PreparedDependency(Test, []);
  repo.addDependency(dep);
  const out = repo.getDependencyByConstructor(Test)
  assertEquals(out?.target, Test)
})

Deno.test('it should get a depenedency by id', () => {
  class Test {}
  const repo = new DependencyManifest();
  const dep = new PreparedDependency(Test, []);
  repo.addDependency(dep);
  const out = repo.getDependencyById(dep.id)
  assertEquals(out?.target, Test)
})


