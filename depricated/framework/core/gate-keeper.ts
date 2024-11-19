import type { Application, Context, RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Inject } from "./core.ts";
import { Logger } from "@logger";

export class GateKeeper {
  logger = Inject(Logger)
  constructor() {}
  private logInput(ctx: RouterContext<any, any>, next: () => void) {
    const req = ctx.request
    const {body, headers, method, ip, url} = req
    const params = ctx.params
    const query = Object.fromEntries(url.searchParams)
    const inptMsg = `Incoming request: ${method.toUpperCase()} ${url.pathname}`
    this.logger.info(inptMsg, {body, headers, method, ip, url, params, query})
  }

  private logOutput(ctx: RouterContext<any, any>, next: () => void) {
    const req = ctx.request
    const {method, url} = req
    const res = ctx.response
    const {body, headers, status} = res
    const outptMsg = `${status} response for ${method.toUpperCase()} ${url.pathname}`
    this.logger.info(outptMsg, {body, headers, status})
  }

  middleware: any = (ctx: RouterContext<any, any>, next: () => void) => {
    this.logInput(ctx, next)
    next()
    this.logOutput(ctx, next)
  }

}

