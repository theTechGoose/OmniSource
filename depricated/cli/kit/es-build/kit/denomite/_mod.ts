import * as esbuild from "#esbuild";
import {parseController} from "../controller-parser/_mod.ts";
import {getController} from '../controller-getter/_mod.ts'
import {rebuildController} from "../controller-rebuilder/_mod.ts";

declare global {
  const ROOT: string;
}

export const handlerMapPlugin = {
  name: "handler-map-plugin",
  setup(build: esbuild.PluginBuild) {
    build.onLoad({ filter: /config\.ts$/ }, async (args) => {
      const controller = await getController(args.path);
      const parsed = parseController(controller);
      const rebuilt = rebuildController(parsed);
      return {
        contents: rebuilt,
        loader: "ts",
      };
    });
  },
};

