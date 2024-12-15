import { assertEquals, assertStringIncludes, fromFileUrl } from "#std";
import { getProjectRoot, TestValueManager } from "@libs/utils";
import {
  buildEndpointOutput,
  ControllerParser,
  getAllControllers,
  buildRegistry
} from "./mod.ts";
import { resolve } from "node:path";

const vm = new TestValueManager(import.meta.url, true);
const mockCwd = await getProjectRoot(fromFileUrl(import.meta.url));
const registryFile = `${mockCwd}/test-data/test-server/registry.ts`;
vm.setNoCacheFlag();

// get cwd
// find all controllers below cwd
// instancitate the controller
// parse each of the endpoints
// -- read the key
// ---- get the path to the directory of the endpoints
// -- read the endpoint directory
// ---- get all of the file paths to the functions
// ---- build the route from the controllerName, route and version for each of the files in the folder
// -- read the value
// ---- get the method by building a relative path from the registry to the endpoint
// -- pull the auth from the canActivate function
// -- build the endpoint
//
//
//

Deno.test("should get all controllers", async () => {
  const testPathSnapshot = await vm.get("controller-paths", 1);
  const controllers = await getAllControllers(mockCwd);
  await vm.setValue("controller-paths", controllers);
  console.log({controllers, testPathSnapshot})
  assertEquals(controllers, testPathSnapshot);
});

Deno.test("it should parse the endpoints using the controller (cached)", async () => {
  const testPathSnapshot = await vm.get("controller-paths", 1);
  const allConfigs = await new ControllerParser(...testPathSnapshot).parse();
  const testEndpointSnapshot = await vm.get("endpoints", 1);
  await vm.setValue("endpoints", allConfigs);
  assertEquals(allConfigs, testEndpointSnapshot);
});

Deno.test("it should build the endpoints using the endpoint configs", async () => {
  const testEndpointSnapshot = await vm.get("endpoints", 1);
  const builtEndpoint = buildEndpointOutput(
    testEndpointSnapshot[0],
    registryFile,
  );
  await vm.setValue("built-endpoints", builtEndpoint);
  assertStringIncludes(builtEndpoint.content, "route: 'dupe-test/run/V001',\n");
});

Deno.test("it should build the complete file", async () => {
  const vmKey = 'registry';
  const endpoints = await vm.get("endpoints", 1);
  const registry = await buildRegistry(endpoints, registryFile);
  await vm.setValue(vmKey, registry);
  const registrySnapshot = await vm.get(vmKey, 1);
  console.log(registry)
  assertEquals(registry, registrySnapshot);
})
