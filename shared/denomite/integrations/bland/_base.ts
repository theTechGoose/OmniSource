import {Request } from "@root/infrastructure/http/_mod.ts";

export abstract class BlandRequest extends Request {
  headers = {
    "Authorization": `Bearer ${Deno.env.get("BLAND_API_KEY")}`,
    "Content-Type": "application/json"
  }
}
