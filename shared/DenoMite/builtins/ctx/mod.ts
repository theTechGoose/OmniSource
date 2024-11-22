import { Context } from "https://deno.land/x/oak/mod.ts";

// Create the class
export class Ctx {
  body!: any;
  constructor(public root: Context) {
    this.body = root.request.body.json();
  }
}

