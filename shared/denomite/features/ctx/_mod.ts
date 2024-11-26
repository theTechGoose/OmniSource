import {Context} from "#oak";
import {Dependency} from "@root/core/resolution/core/_mod.ts";

@Dependency
export class OakCtx {
  static id = "r4LDIFMpxsLu3xjDvicHI"
  id = "r4LDIFMpxsLu3xjDvicHI"
  body!: ReturnType<Context["request"]["body"]["json"]>;
  constructor(public root: Context) {
    if (!root?.request?.hasBody) return;
    this.body = root.request.body.json();
  }
}
