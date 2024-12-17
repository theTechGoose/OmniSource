import { Server } from "@libs/denomite";
import { withTryCatch } from "@libs/utils";

const [impx] = await withTryCatch(() => import("./registry.ts"));


  const registry = impx?.registry
  const server = new Server(registry ?? []);
  await server.start(8000);
