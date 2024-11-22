import type { HttpVerbs } from "../../../../models/core.d.ts";
import {Request } from "../http/base.ts";

const baseUrl = "https://api.slicktext.com/v1";
const headers = {
  authorization: `Basic ${Deno.env.get("SLICK_TEXT_SECRET")}`,
};

export abstract class SlickTextRequest<T extends HttpVerbs = any> extends Request<T> {
  protected baseUrl = baseUrl;
  headers = headers;
 checkRateLimit(responseHeaders: any) {
  const rateLimitRemaining = +responseHeaders["X-RateLimit-Remaining"];
  const rateLimitReset = +responseHeaders["X-RateLimit-Reset"];
  if (rateLimitRemaining === 0) {
    return rateLimitReset;
  }
  return 0;
}
}
