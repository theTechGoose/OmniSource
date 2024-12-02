import * as esbuild from "#esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";
import { handlerMapPlugin } from "../kit/denomite/_mod.ts";
import  tscPlugin  from 'npm:esbuild-plugin-tsc';

const define = {
  ROOT: `"${Deno.cwd()}"`
}

export class Builder {
  defaults: esbuild.BuildOptions = {
    plugins: [...denoPlugins(), handlerMapPlugin, tscPlugin({force: true})],
    outdir: "dist",
    bundle: true,
    splitting: true,
    target: "esnext",
    format: "esm",
    define,
  }

  constructor(public readonly entrypoint: string) {}

  // Original build method
  async build() {
    await esbuild.build({
      ...this.defaults,
      entryPoints: [this.entrypoint],
    });
    await esbuild.stop();
  }

  // New buildAndWatch method for watching changes
  async buildAndWatch() {
    try {
      const context = await esbuild.context({
        ...this.defaults,
        entryPoints: [this.entrypoint],
      });

      console.log('Watching for changes...');
      console.log(Math.random())

      // Call the watch method on the returned context object
      await context.watch();
    } catch (error) {
      console.error('Error while building and watching:', error);
    }
  }
}
