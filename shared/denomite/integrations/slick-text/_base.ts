import {Request } from "@root/infrastructure/http/_mod.ts";

const baseUrl = "https://api.slicktext.com/v1";
const headers = {
  authorization: `Basic ${Deno.env.get("SLICK_TEXT_SECRET")}`,
};

export abstract class SlickTextRequest extends Request {
  override baseUrl = baseUrl;
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
