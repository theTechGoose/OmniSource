import { Context } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { ContextCallback } from "@shared";
import { handleMetadata } from "@shared";
import { container } from "tsyringe";

export function createObjectDecorator(ifErrorMessage: string, extractor: any) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    handleMetadata(
      "set",
      target,
      String(propertyKey),
      parameterIndex,
      { type: 'obj', extractor, ifErrorMessage },
    );
  };
}

export function createParamDecorator(ifErrorMessage: string, extractor: ContextCallback) {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    handleMetadata(
      "set",
      target,
      String(propertyKey),
      parameterIndex,
      { type: 'extractor', extractor, ifErrorMessage },
    );
  };
}

export const Body = createParamDecorator("Error parsing body, this happens when the body is not JSON or is empty, in body param decorator" ,async (ctx: Context) => {
  try {
    return await ctx.request.body.json();
  } catch (_e: unknown) {
    const e = _e as Error;
    throw new Error(e.message);
  }
});


export const Db = createObjectDecorator("Error opening Kv store, in Db decorator", async (_: any) => {
    const loc = Deno.env.get('KV_LOCATION')
    const instance = container.resolve('kv')
    return Deno.openKv(loc)
});

