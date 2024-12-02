import {Dependency, OakCtx} from "@shared/denomite";
import {OptInDto} from "@shared/denomite/integrations/slick-text";

@Dependency
export class OptContactInDto extends OptInDto {
  constructor(ctx: OakCtx) {
    super();
    Object.assign(this, ctx.body);
  }
}
