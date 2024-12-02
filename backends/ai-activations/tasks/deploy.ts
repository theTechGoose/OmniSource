import {Builder} from "@shared/cli";
//import * as esbuild from "npm:esbuild@0.20.2";
//// Import the Wasm build on platforms where running subprocesses is not
//// permitted, such as Deno Deploy, or when running without `--allow-run`.
//// import * as esbuild from "https://deno.land/x/esbuild@0.20.2/wasm.js";
//
//import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@^0.11.0";
//
//const result = await esbuild.build({
//  plugins: [...denoPlugins()],
//  entryPoints: ["../main.ts"],
//  outdir: "dist",
//  splitting: true,
//  bundle: true,
//  format: "esm",
//  target: "esnext",
//});
//
//esbuild.stop();
//
//

const builder = new Builder('../main.ts')
await builder.build()
