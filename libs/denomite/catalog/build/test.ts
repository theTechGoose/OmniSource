import { assertEquals, assertStringIncludes } from "@assert";
import { TestValueManager } from "@libs/utils";
import {
  buildEndpointOutput,
  buildRegistry,
  ControllerParser,
  getAllControllers,
} from "./mod.ts";

const vm = new TestValueManager(import.meta.url, [
  "controller-paths",
  "endpoint-configs",
  "endpoints",
  "registry",
]);

Deno.test("should get all controllers", async () => {
  const [snap] = await vm.get("controller-paths");
  const controllers = await getAllControllers(await vm.mockCwd);
  assertEquals(controllers, snap);
});

Deno.test("it should parse the endpoints using the controller (cached)", async () => {
  const [pathSnap] = await vm.get("controller-paths");
  const allConfigs = await new ControllerParser(...pathSnap).parse();
  const endpointConfigSnap = {
    method: "Post",
    fullRoute: "dupe-test/run/V001",
    fullPath:
      "/Users/goose/Documents/New_Programing/OmniSource/libs/denomite/test-data/test-server/dupe-test/e1/v001.ts",
    controllerName: "DupeTestController",
    controllerPath:
      "/Users/goose/Documents/New_Programing/OmniSource/libs/denomite/test-data/test-server/dupe-test/config.ts",
  };

  assertEquals(allConfigs[0], endpointConfigSnap);
  const [_, update] = await vm.get("endpoint-configs");
  update(allConfigs);
});

Deno.test("it should build the endpoints using the endpoint configs", async () => {
  const registryFile = await vm.file("ts", "test-server", "registry");
  const [snap] = await vm.get("endpoint-configs");
  const builtEndpoint = buildEndpointOutput(snap[0], registryFile);
  const [_, update] = await vm.get("endpoints");
  console.log(builtEndpoint);
  await update(builtEndpoint);

  const sample = {
    "imprt": "import CRWsWKFtERtHkjOxMjGExJXGg from './dupe-test/e1/v001.ts';",
    content: {
      method: "post",
      route: "dupe-test/run/V001",
    },
  };
  assertStringIncludes(builtEndpoint.content, sample.content.route);
  assertStringIncludes(builtEndpoint.content, sample.content.method);
});

Deno.test("it should build the complete file", async () => {
  const registryFile = await vm.file("ts", "test-server", "registry");
  const [endpointSnap] = await vm.get("endpoint-configs");
  const registry = await buildRegistry(endpointSnap, registryFile);
  const [_, update] = await vm.get("registry");
  await update(registry);
  assertStringIncludes(registry, "./dupe-test/e1/v001.ts");
});
